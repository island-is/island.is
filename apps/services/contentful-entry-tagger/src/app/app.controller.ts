import { Body, Controller, Post } from '@nestjs/common'
import type { Entry } from 'contentful-management'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/entry-created')
  async onEntryCreation(@Body() entry: Entry) {
    const result = await this.appService.handleEntryCreation(entry)
    return result
  }
}
