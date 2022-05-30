import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO } from '../dto/updateUser.dto';

export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession): Promise<User> {
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
    async getUserByEmail(username: string): Promise<User> {
        let user;
        try {
            user = await this.userModel.findOne({ userName : username }).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    async getUserByid(id: MongooseSchema.Types.ObjectId) : Promise<User>{
        let user;
        try {
            user = await this.userModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    async getUsers(): Promise<User[]>{
        let users;
        try {
            users = await this.userModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return users;
    }

    async updateUser(updateUserDto: UpdateUserDTO, session: ClientSession) {
        const actualDate = new Date();
        actualDate.toUTCString();
        const updateData : any = {...updateUserDto};
        updateData.updatedAt = actualDate;
        let product;
        try {
            product = await this.userModel
                .findOneAndUpdate({ _id: updateUserDto.id}, updateData, {
                    new: true,
                })
                .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!product) {
            throw new ConflictException('Error trying to update product');
        }
        return product;
    }
}