import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2 } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ReturnObject } from './entities/return-object';

@Controller('api/home')
@UseGuards(AuthGuard("jwt"))
@ApiOAuth2([])
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): ReturnObject {
    return {
      success: true,
      message: this.appService.getHello()
    }
  }
}
