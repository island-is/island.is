import { Controller, Get } from '@nestjs/common'
import { UniversityService } from './university.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UniversityResponse } from './model'

@ApiTags('University')
@Controller()
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('universities')
  @ApiOkResponse({
    type: UniversityResponse,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get universities',
  })
  async getUniversities(): Promise<UniversityResponse> {
    return this.universityService.getUniversities()
  }
}
