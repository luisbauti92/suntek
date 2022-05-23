import { Body, Controller, Get, Post } from '@nestjs/common';
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
  async loginUser(@Body() Credential: LoginDto): Promise<string> {
    const result = await this.userService.getUser(Credential);
    console.log(result);
    return 'hola mundo jorge';
  }
}
