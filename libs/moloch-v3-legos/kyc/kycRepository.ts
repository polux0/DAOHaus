import { Kyc } from './kyc';
export interface KycRepository {
  findById(id: string): Promise<Kyc | null>;
  findAll(): Promise<Kyc[]>;
  create(user: Kyc): Promise<Kyc>;
  update(id: string, user: Partial<Kyc>): Promise<Kyc>;
  delete(id: string): Promise<void>;
  // technical debt - create `Secret` type
  getDecryptedSecret(): Promise<any>;
  getSecret(): Promise<any>;
}
