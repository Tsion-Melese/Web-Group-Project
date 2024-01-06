
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client'; 
import CreateUserDto from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type HashFunction = (password: string, saltOrRounds: number) => Promise<string>;

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const bcryptHash: HashFunction = bcrypt.hash;
      const hashedPassword = await bcryptHash(createUserDto.hash, 10);
  
      const newUser = await this.db.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          hash: hashedPassword,
        },
      });
  
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.error('Duplicate email:', createUserDto.email);
      }
  
      throw new InternalServerErrorException(`Something: ${error.message || error}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.db.user.findMany();
      return allUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  


  async deleteUser(userId: string) {
    try {
      await this.db.user.delete({
        where: { id: userId },
      });
      return {
        statusCode: 200,
        message: `User with ID ${userId} successfully deleted`,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  }
  
  

 
 
  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      console.log('Received userId:', userId);
  
      if (!userId) {
        throw new BadRequestException('UserId is required for updating the user.');
      }
  
      const user = await this.db.user.update({
        where: { id: userId },
        data: { ...dto },
      });
  
      delete user.hash;
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }


  async getUserById(userId: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id: userId },
    });
  }
  
  }
  
  
  
  
  
