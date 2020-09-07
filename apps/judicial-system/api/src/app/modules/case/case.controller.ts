import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { JwtAuthGuard } from '../auth'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case } from './case.model'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Get('cases')
  @ApiOkResponse({ type: Case, isArray: true })
  async getAll(@Req() req) {
    this.logger.debug('Received request from user', {
      extra: { user: req.user },
    })

    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case })
  async findOne(@Param('id') id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return existingCase
  }

  @Post('case')
  @ApiCreatedResponse({ type: Case })
  async create(
    @Body(new CaseValidationPipe(true))
    caseToCreate: CreateCaseDto,
  ) {
    return this.caseService.create(caseToCreate)
  }

  @Put('case/:id')
  @ApiOkResponse({ type: Case })
  async update(
    @Param('id') id: string,
    @Body()
    caseToUpdate: UpdateCaseDto,
  ) {
    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`An case with the id ${id} does not exist`)
    }

    return updatedCase
  }
}
