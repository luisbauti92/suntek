import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userService: UserService) {}

    @Get()
    async getUsers(@Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/:userId')
    async getSingleUser(@Res() res, @Param('userId') userId : MongooseSchema.Types.ObjectId) {
        const users = await this.userService.getUserbyId(userId);
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
    @Put('/:id')
    async updateUser(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateProductDto: UpdateUserDTO, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        updateProductDto.id = id;
        session.startTransaction();
        try {
            const newProduct: any = await this.userService.updateUser(updateProductDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newProduct);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
