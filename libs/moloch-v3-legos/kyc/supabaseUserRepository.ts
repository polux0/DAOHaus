import { Information } from './information';
import { UserRepository } from './userRepository';
import initiateSupabase from './supabase';

// Initialize Supabase client
const supabase = initiateSupabase();

export class SupabaseUserRepository implements UserRepository {
  async findById(id: string): Promise<Information | null> {
    const { data: information, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return information;
  }

  async findAll(): Promise<Information[]> {
    const { data: information, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    return information;
  }

  async create(user: Information): Promise<Information> {
    const { data: newInformation, error } = await supabase
      .from('users')
      .insert([user])
      .single();

    if (error) throw error;
    return newInformation;
  }

  async update(id: string, userUpdate: Partial<Information>): Promise<Information> {
    const { data: updatedInformation, error } = await supabase
      .from('users')
      .update(userUpdate)
      .eq('id', id)
      .single();

    if (error) throw error;
    return updatedInformation;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
