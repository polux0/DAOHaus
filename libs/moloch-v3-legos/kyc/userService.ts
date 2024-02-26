import { Information } from './information'
import { UserRepository } from './userRepository'
export class UserService {
    constructor(private userRepository: UserRepository) {}
  
    async getUserById(id: string): Promise<Information | null> {
      try {
        return await this.userRepository.findById(id);
      } catch (error) {
        console.error(`Error fetching user by ID ${id}:`, error);
        throw error; // Re-throw the error after logging it, so the calling code can handle it as well.
      }
    }
  
    async getAllUsers(): Promise<Information[]> {
      try {
        return await this.userRepository.findAll();
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    }
  
    async createUser(userData: Partial<Information>): Promise<Information> {
      try {
        const newUser: Information = {
        //   id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          fullName: userData.fullName!,
          emailAddress: userData.emailAddress!,
          phoneNumber: userData.phoneNumber!,
          gdprConsent: userData.gdprConsent!,
        };
  
        return await this.userRepository.create(newUser);
      } catch (error) {
        console.error('Error creating a new user:', error);
        throw error;
      }
    }
  
    async updateUser(id: string, userData: Partial<Information>): Promise<Information> {
      try {
        userData.updatedAt = new Date(); // Update the 'updatedAt' field
        return await this.userRepository.update(id, userData);
      } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
      }
    }
  
    async deleteUser(id: string): Promise<void> {
      try {
        await this.userRepository.delete(id);
      } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
      }
    }
  }
  