import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { LoginDto } from '../../dto/login.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class LoginController {

  constructor(private userService: UserService) {}

  @Get()
  getLogin(): string {
    return 'Retrieving Login';
  }

  @Post('login')
  //@HttpCode(HttpStatus.NO_CONTENT)
  async loginUser(@Body() Credential: LoginDto) {
    return await this.userService.getUser(Credential);
  }
}
