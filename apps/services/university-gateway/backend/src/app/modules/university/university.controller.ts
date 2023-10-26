import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get } from '@nestjs/common'
import { UniversityService } from './university.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UniversityResponse } from './model'

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
  @ApiOkResponse({
    type: UniversityResponse,
    description: 'Returns all universities',
  })
  @ApiOperation({
    summary: 'Get all universities',
  })
  async getUniversities(): Promise<UniversityResponse> {
    return this.universityService.getUniversities()
  }
}
