import { Controller, Post } from '@nestjs/common'
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { InternalProgramService } from './internalProgram.service'

@ApiTags('Internal program')
@Controller('api/internal')
export class InternalProgramController {
  constructor(
    private readonly internalProgramService: InternalProgramService,
  ) {}

  @Post('programs/update')
  @ApiNoContentResponse()
  @ApiOperation({
    summary:
      'Updates program in our DB by fetching data from the university APIs',
  })
  async updatePrograms(): Promise<void> {
    console.log('--------HER updatePrograms')
    // await this.internalProgramService.updatePrograms()
  }
}
