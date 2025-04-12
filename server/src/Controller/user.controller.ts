/* eslint-disable prettier/prettier */
import {
  Get,
  Put,
  Delete,
  Body,
  Param,
  Controller,
  HttpStatus,
  HttpException,
  Post,
  
} from '@nestjs/common';
import { UserService } from '../Service/user.service';
import { User } from '../Model/user.model';
import { CreateUserDto, UpdateUserDto } from '../Model/Dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      const userToCreate: User = {
        id: uuidv4(),
        ...userData,
      };
      const createdUser = await this.userService.createUser(userToCreate);
      return createdUser;
    } catch (error: unknown) {
      console.error('error: ', error);
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAllUsers(): Promise<User[] | null> {
    try {
      const users = await this.userService.getAllUser();
      if (!users) {
        return null;
      }
      return users;
    } catch (error: unknown) {
      console.error('error', error);
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error: unknown) {
      console.error('error', error);
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser(id, updateData);
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error: unknown) {
      console.error('error', error);
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'User successfully deleted' };
    } catch (error: unknown) {
      console.error('error', error);
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
  }
}
