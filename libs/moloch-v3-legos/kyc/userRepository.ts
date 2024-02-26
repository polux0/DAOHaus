import {Information} from './information' 
export interface UserRepository {
    findById(id: string): Promise<Information | null>;
    findAll(): Promise<Information[]>;
    create(user: Information): Promise<Information>;
    update(id: string, user: Partial<Information>): Promise<Information>;
    delete(id: string): Promise<void>;
  }
  