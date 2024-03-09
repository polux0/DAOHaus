import { KycRepository } from './kycRepository';
import { initiateSupabase, signInUser } from './supabase';
import { Kyc } from './kyc';

// Initialize Supabase client
const supabase = initiateSupabase();

export class SupabaseKycRepository implements KycRepository {
  async findById(id: string): Promise<Kyc | null> {
    const { data: Kyc, error } = await supabase
      .from('kyc')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return Kyc;
  }

  async findAll(): Promise<Kyc[]> {
    const { data: Kyc, error } = await supabase.from('kyc').select('*');

    if (error) throw error;
    return Kyc;
  }

  async create(user: Kyc): Promise<Kyc> {
    const { data: newKyc, error } = await supabase
      .from('kyc')
      .insert([user])
      .single();

    if (error) throw error;
    return newKyc;
  }

  async update(id: string, userUpdate: Partial<Kyc>): Promise<Kyc> {
    const { data: updatedKyc, error } = await supabase
      .from('kyc')
      .update(userUpdate)
      .eq('id', id)
      .single();

    if (error) throw error;
    return updatedKyc;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('kyc').delete().eq('id', id);

    if (error) throw error;
  }
  async getDecryptedSecret(): Promise<any> {
    const { data, error } = await supabase
      .from('vault.decrypted_secrets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching decrypted secrets:', error);
      return null;
    }
    return data;
  }
  async getSecret() {
    await signInUser();
    const { data, error } = await supabase.rpc('get_recent_decrypted_secrets');

    if (error) {
      console.error('Error fetching secrets', error);
      return null; // or handle the error as appropriate for your application
    }

    return data;
  }
}
