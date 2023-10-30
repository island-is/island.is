import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get } from '@nestjs/common'
import { UniversityService } from './university.service'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { UniversityResponse } from './dto/universityResponse'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('University')
@Controller({
  path: 'universities',
  version: ['1'],
})
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @BypassAuth()
  @Get()
  @Documentation({
    description: 'Get all universities',
    response: {
      status: 200,
      type: UniversityResponse,
    },
  })
  getUniversities(): Promise<UniversityResponse> {
    return this.universityService.getUniversities()
  }
}
