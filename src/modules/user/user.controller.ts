import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userService: UserService) {}

    @Get()
    async getUsers(@Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }
    @Post()
    //@HttpCode(HttpStatus.NO_CONTENT)
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newUser: any = await this.userService.createUser(createUserDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.CREATED).send(newUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
