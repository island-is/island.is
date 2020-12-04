import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReturnObject } from './entities/return-object';

@Controller('api/home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<ReturnObject> {
    return await this.appService.getHello();
  }
}
