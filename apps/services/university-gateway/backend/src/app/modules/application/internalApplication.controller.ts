import { UseGuards } from '@nestjs/common'
import { TokenGuard } from '@island.is/judicial-system/auth'
import { Controller, Post } from '@nestjs/common'
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { InternalApplicationService } from './internalApplication.service'

@UseGuards(TokenGuard)
@ApiTags('Internal application')
@Controller({
  path: 'internal/applications',
  version: ['1'],
})
export class InternalApplicationController {
  constructor(
    private readonly internalApplicationService: InternalApplicationService,
  ) {}

  @Post('update')
  @ApiNoContentResponse()
  @ApiOperation({
    summary:
      'Updates application statuses in our DB by fetching data from the university APIs.Should also update application status in the application system DB',
  })
  updateApplicationStatus() {
    this.internalApplicationService.updateApplicationStatus()
  }
}
