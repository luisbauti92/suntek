import { ConflictException, Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession): Promise<User> {
        const createdUser = await this.userRepository.createUser(createUserDto, session);
        return createdUser;
    }

    async getUser(loginDto: LoginDto): Promise<User> {
        const findUser = await this.userRepository.getUserByEmail(loginDto.username)
        if (findUser && bcrypt.compareSync(loginDto.password, findUser.password)) {
            return findUser;
        }
        else {
            throw new ConflictException('Error User or Password Incorrect');
        }
    }

    async getUsers(): Promise<User[]>  {
        const user = await this.userRepository.getUsers();
        return user;
    }

    async getUserbyId(userId: MongooseSchema.Types.ObjectId): Promise<User> {
        const user = await this.userRepository.getUserByid(userId); 
        return user;
    }

    async updateUser(updateUserDto: UpdateUserDTO, session: ClientSession) {
        return await this.userRepository.updateUser(updateUserDto, session);
    }

    async deleteProduct(userId: MongooseSchema.Types.ObjectId): Promise<any> {
        return await this.userRepository.deleteUser(userId);
    }
}
