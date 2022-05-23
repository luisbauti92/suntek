import { ConflictException, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { LoginDto } from 'src/dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession) {
        const createdUser = await this.userRepository.createUser(createUserDto, session);
        return createdUser;
    }

    async getUser(loginDto: LoginDto) {
        const findUser = await this.userRepository.getUserByEmail(loginDto.username)
        if (findUser && bcrypt.compareSync(loginDto.password, findUser.password)) {
            return findUser;
        }
        else {
            throw new ConflictException('User not created');
        }
    }
}
