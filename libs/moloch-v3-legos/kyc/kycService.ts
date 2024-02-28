import { Kyc } from "./kyc";
import { KycRepository } from "./kycRepository";

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

  async createUser(userData: Partial<Kyc>): Promise<Kyc> {
    try {
      
      const newUser: Kyc = {
        //   id: this.generateId(),
        created_at: new Date(),
        updated_at: new Date(),
        full_name: userData.full_name!,
        email_address: userData.email_address!,
        phone_number: userData.phone_number!,
        gdpr_consent: userData.gdpr_consent!,
      };
      console.log('Creating new user', newUser);
      return await this.kycRepository.create(newUser);
    } catch (error) {
      console.error('Error creating a new user:', error);
      console.error('error', error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    userData: Partial<Kyc>
  ): Promise<Kyc> {
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
