// added for purposes of RobinHoodDAO

import { Kyc } from '../kyc/kyc';

// Define the type for the encryption key
export type CryptoKeyAES = CryptoKey & {
  algorithm: { name: 'AES-GCM'; length: 256 };
};

// Generate an AES-GCM encryption key
export async function generateKey(): Promise<CryptoKeyAES> {
  return (await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // whether the key is extractable (i.e., can be used in exportKey)
    ['encrypt', 'decrypt'] // can be: "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  )) as CryptoKeyAES;
}

// Encrypt data using the provided key
export async function encryptData(
  data: string,
  key: CryptoKeyAES
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector for AES-GCM
  const encodedData = new TextEncoder().encode(data);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  return { encryptedData, iv };
}

// technical debt
export async function encryptKycData(
  data: Kyc,
  key: CryptoKeyAES
): Promise<{
  fullNameEncrypted: ArrayBuffer;
  emailAddressEncrypted: ArrayBuffer;
  phoneNumberEncrypted: ArrayBuffer;
  iv: Uint8Array;
}> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector for AES-GCM

  const encodedDataFullName = new TextEncoder().encode(data.full_name);
  const encodedDataEmailAddress = new TextEncoder().encode(data.email_address);
  const encodedDataMobilePhoneNumber = new TextEncoder().encode(
    data.phone_number
  );

  const fullNameEncrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedDataFullName
  );
  const emailAddressEncrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedDataEmailAddress
  );
  const phoneNumberEncrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedDataMobilePhoneNumber
  );

  return { fullNameEncrypted, emailAddressEncrypted, phoneNumberEncrypted, iv };
}

// Decrypt data using the provided key and IV
export async function decryptData(
  encryptedData: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKeyAES
): Promise<string> {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedData);
}

// Convert an ArrayBuffer to a base64 string
export function bufferToBase64(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract base64 data from the reader result
      const base64data = reader.result as string;
      // Resolve the base64 string, removing the data URL part
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Export the key to a raw format and convert to base64 string for storage
export async function exportKey(key: CryptoKeyAES): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64(exportedKey);
}

// Convert a base64 string to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64); // Convert base64 to binary string
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Import a key from a base64 string
export async function importKey(base64Key: string): Promise<CryptoKeyAES> {
  const keyBuffer = base64ToBuffer(base64Key);
  return (await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )) as CryptoKeyAES;
}
