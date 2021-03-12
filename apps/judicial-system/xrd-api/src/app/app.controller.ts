import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import { AppService } from './app.service'
import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  create(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    return this.appService.create(caseToCreate)
  }
}
