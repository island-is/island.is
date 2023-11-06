import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { InternalProgramService } from './internalProgram.service'

//TODOx remove as controller?
@ApiTags('Internal program')
@Controller({
  path: 'internal/programs',
  version: ['1'],
})
export class InternalProgramController {
  constructor(
    private readonly internalProgramService: InternalProgramService,
  ) {}

  @Post('update')
  @Documentation({
    description:
      'Updates program in our DB by fetching data from the university APIs',
  })
  async updatePrograms() {
    await this.internalProgramService.updatePrograms()
  }
}
