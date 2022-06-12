import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/dto/createUser.dto';

export class UpdateUserDTO extends PartialType(CreateUserDto) {}