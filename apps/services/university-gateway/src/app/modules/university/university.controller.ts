import { BypassAuth } from '@island.is/auth-nest-tools'
import { Controller, Get } from '@nestjs/common'
import { UniversityService } from './university.service'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { UniversitiesResponse } from './dto/universitiesResponse'

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
      type: UniversitiesResponse,
    },
  })
  getUniversities(): Promise<UniversitiesResponse> {
    return this.universityService.getUniversities()
  }
}
