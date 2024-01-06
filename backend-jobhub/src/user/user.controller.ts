import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorator/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import CreateUserDto from './dto/create-user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return { user: newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Something went wrong' };
    }
  }

  @Get()
async getAllUsers(): Promise<User[]> {
  try {
    const allUsers = await this.userService.getAllUsers();
    return allUsers;
  } catch (error) {
    console.error('Error getting all users:', error);
    return []; 
  }
}

  


@Delete(':id')
async deleteUser(@Param('id') userId: string) {
  try {
    const result = await this.userService.deleteUser(userId);
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Something went wrong' };
  }
}


@Patch(':id')
updateUser(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
  return this.userService.updateUser(userId, dto);
}

@Get(':id')
async getUserById(@Param('id') userId: string): Promise<User> {
  const user = await this.userService.getUserById(userId);

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  return user;
}



}
