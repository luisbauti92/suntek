import { Schema as MongooseSchema } from 'mongoose';
export class CreateUserDto {
    id?: MongooseSchema.Types.ObjectId;
    readonly fullName: string;
    readonly role: string;
    readonly username: string;
    readonly password: string;
}