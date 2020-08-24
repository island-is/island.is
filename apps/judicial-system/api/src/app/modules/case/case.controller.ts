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

@ApiTags('case')
@Controller('case')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get(':id')
  @ApiOkResponse({ type: Case })
  async findOne(@Param('id') id: string): Promise<Case> {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`An case with the id ${id} does not exist`)
    }

    return existingCase
  }

  @Post()
  @ApiCreatedResponse({ type: Case })
  async create(
    @Body(new CaseValidationPipe(true))
    caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

  @Put(':id')
  @ApiOkResponse({ type: Case })
  async update(
    @Param('id') id: string,
    @Body(new CaseValidationPipe(true))
    caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
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
