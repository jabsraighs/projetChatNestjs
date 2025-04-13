/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Model/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = this.userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Create User Error:', error);
      throw new NotFoundException('Could not create user');
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } 
     catch(error) {
      console.error(error);
      throw new NotFoundException('Could not retrieve users');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not retrieve user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not retrieve user');
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const result = await this.userRepository.update(id, updateData);
      if (result.affected === 0) {
        return null;
      }
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found after update`);
      }
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not delete user');
    }
  }
}