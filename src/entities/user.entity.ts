import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    userName: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['ADMIN', 'USER'] })
    role: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export const UserSchema = SchemaFactory.createForClass(User).pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});