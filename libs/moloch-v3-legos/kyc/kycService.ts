import {
  CryptoKeyAES,
  bufferToBase64,
  base64ToBuffer,
  encryptKycData,
  decryptData,
  importKey,
} from '../utils/encryption';
import { Kyc } from './kyc';
import { KycRepository } from './kycRepository';

export class KycService {
  constructor(private kycRepository: KycRepository) {}

  async getUserById(id: string): Promise<Kyc | null> {
    try {
      return await this.kycRepository.findById(id);
    } catch (error) {
      console.error(`Error fetching user by ID ${id}:`, error);
      throw error; // Re-throw the error after logging it, so the calling code can handle it as well.
    }
  }

  async getAllUsers(): Promise<Kyc[]> {
    try {
      return await this.kycRepository.findAll();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
  async getEncryptionKey(): Promise<string> {
    try {
      return await this.kycRepository.getSecret();
    } catch (error) {
      console.error('Error fetching encryption key:', error);
      throw error;
    }
  }
  async prepareKycUser(formValues: any, nftId: number): Promise<Kyc> {
    return {
      created_at: new Date(),
      updated_at: new Date(),
      full_name: formValues.fullName,
      email_address: formValues.emailAddress,
      phone_number: formValues.phoneNumber,
      gdpr_consent: true,
      nft_id: nftId,
      iv: 'iv',
    };
  }
  async encryptUserData(user: Kyc, key: CryptoKeyAES): Promise<Kyc> {
    const {
      fullNameEncrypted,
      emailAddressEncrypted,
      phoneNumberEncrypted,
      iv,
    } = await encryptKycData(user, key);

    return {
      ...user,
      full_name: await bufferToBase64(fullNameEncrypted),
      email_address: await bufferToBase64(emailAddressEncrypted),
      phone_number: await bufferToBase64(phoneNumberEncrypted),
      iv: await bufferToBase64(iv),
    };
  }
  async decryptUserData(encryptedUser: Kyc, key: CryptoKeyAES): Promise<Kyc> {
    // Decode the Base64 strings back into byte buffers
    const ivBuffer = await base64ToBuffer(encryptedUser.iv);
    const fullNameBuffer = await base64ToBuffer(encryptedUser.full_name);
    const emailAddressBuffer = await base64ToBuffer(encryptedUser.email_address);
    const phoneNumberBuffer = await base64ToBuffer(encryptedUser.phone_number);

    const encryptedDataUint8 = new Uint8Array(ivBuffer);
    // Decrypt the data using the AES decryption algorithm, the key, and the IV
    const fullNameDecrypted = await decryptData(fullNameBuffer, encryptedDataUint8, key);
    const emailAddressDecrypted = await decryptData(emailAddressBuffer, encryptedDataUint8, key);
    const phoneNumberDecrypted = await decryptData(phoneNumberBuffer, encryptedDataUint8, key);
    
    console.log("data decrypted: " + fullNameDecrypted);
    // Construct and return the decrypted user object
    return {
      ...encryptedUser, // You might want to exclude the encrypted fields
      full_name: fullNameDecrypted,
      email_address: emailAddressDecrypted,
      phone_number: phoneNumberDecrypted,
    };
  }
  
  async createUser(userData: Partial<Kyc>): Promise<Kyc> {
    try {
      const newUser: Kyc = {
        created_at: new Date(),
        updated_at: new Date(),
        full_name: userData.full_name!,
        email_address: userData.email_address!,
        phone_number: userData.phone_number!,
        gdpr_consent: userData.gdpr_consent!,
        nft_id: userData.nft_id!,
        iv: userData.iv!,
      };
      return await this.kycRepository.create(newUser);
    } catch (error) {
      console.error('Error creating a new user:', error);
      throw error;
    }
  }
  public async createAndEncryptUser(
    formValues: any,
    nftId: number
  ): Promise<void> {
    try {
      const keyString = process.env.NX_KYC_ENCRYPTION_KEY;
      if (!keyString) throw new Error('NX_KYC_ENCRYPTION_KEY is not defined!');
      const key = await importKey(keyString);
      const user = await this.prepareKycUser(formValues, nftId);
      const encryptedUserData = await this.encryptUserData(user, key);
      await this.createUser(encryptedUserData);
    } catch (error) {
      console.error('Error persisting KYC information', error);
      throw error; // Rethrow or handle as needed
    }
  }

  async updateUser(id: string, userData: Partial<Kyc>): Promise<Kyc> {
    try {
      userData.updated_at = new Date(); // Update the 'updatedAt' field
      return await this.kycRepository.update(id, userData);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.kycRepository.delete(id);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}
