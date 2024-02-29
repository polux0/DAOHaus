import { KycRepository } from './kycRepository';
import initiateSupabase from './supabase';
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
}
