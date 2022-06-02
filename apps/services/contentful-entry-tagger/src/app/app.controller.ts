import { Body, Controller, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { Entry } from './types'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('entry-created')
  async onEntryCreation(@Body() entry: Entry) {
    const result = await this.appService.handleEntryCreation(entry)
    return result
  }
}
