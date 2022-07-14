import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private jwtAuthService: JwtService ) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession): Promise<User> {
        const createdUser = await this.userRepository.createUser(createUserDto, session);
        return createdUser;
    }

    async getUser(loginDto: LoginDto) {
        const findUser = await this.userRepository.getUserByEmail(loginDto.username)
        if (findUser && bcrypt.compareSync(loginDto.password, findUser.password)) {
            const payload = {id: findUser._id, name: findUser.fullName}
            const token = await this.jwtAuthService.sign(payload);
            return {user: findUser, token};
        }
        else {
            throw new HttpException('Error User or Password Incorrect', 403);
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
