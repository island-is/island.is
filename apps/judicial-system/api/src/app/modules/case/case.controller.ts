import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Case } from './case.model'
import { CaseService } from './case.service'
import { CreateCaseDto } from './dto/createCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { CaseValidationPipe } from './case.pipe'

@ApiTags('cases')
@Controller('api')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get('cases')
  @ApiOkResponse({ type: Case, isArray: true })
  async getAll() {
    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case })
  async findOne(@Param('id') id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`An case with the id ${id} does not exist`)
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
