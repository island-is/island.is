import { Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { Entry } from './types'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async onEntryCreation(@Body() entry: Entry) {
    return this.appService.handleEntryCreation(entry)
  }
}
