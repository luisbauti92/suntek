import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { LoginDto } from '../../dto/login.dto';
import { UserService } from '../user/user.service';

@Controller('login')
export class LoginController {

  constructor(private userService: UserService) {}

  @Get()
  getLogin(): string {
    return 'Retrieving Login';
  }

  @Post()
  //@HttpCode(HttpStatus.NO_CONTENT)
  async loginUser(@Body() Credential: LoginDto): Promise<User> {
    return await this.userService.getUser(Credential);
  }
}
