import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { User } from 'src/entities/user.entity';

export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession) {
        let user = await this.getUserByEmail(createUserDto.username);

        if (user) {
            throw new ConflictException('User already exists');
        }

        user = new this.userModel({
            fullName: createUserDto.fullName,
            userName: createUserDto.username,
            password: createUserDto.password,
            role: createUserDto.role,
        });

        try {
            user = await user.save({ session });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new ConflictException('User not created');
        }

        return user;
    }
    async getUserByEmail(username: string) {
        let user;
        try {
            user = await this.userModel.findOne({ userName : username }).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }
}