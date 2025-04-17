/* eslint-disable prettier/prettier */
// user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../Service/user.service';
import { CreateUserDto, UpdateUserDto } from '../Model/Dto/user.dto';
import { User } from '../Model/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param() params: UpdateUserDto, @Body() updateUserDto: UpdateUserDto) {
  console.error('Params:', params);
  console.error('UpdateUserDto:', updateUserDto);
  return this.userService.update(params.id, updateUserDto);
}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}