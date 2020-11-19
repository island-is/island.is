import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Inject,
  ForbiddenException,
  Query,
  ConflictException,
  Res,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { CaseState } from '@island.is/judicial-system/types'

import { UserService } from '../user'
import { CreateCaseDto, TransitionCaseDto, UpdateCaseDto } from './dto'
import { Case, SignatureConfirmationResponse } from './models'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'
import { transitionCase } from './case.state'

@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    @Inject(CaseService)
    private readonly caseService: CaseService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return existingCase
  }

  private async findUserByNationalId(nationalId: string) {
    const user = await this.userService.findByNationalId(nationalId)

    if (!user) {
      throw new NotFoundException(`User ${nationalId} not found`)
    }

    return user
  }

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  create(
    @Body(new CaseValidationPipe())
    caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

  @Put('case/:id')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('id') id: string,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return updatedCase
  }

  @Put('case/:id/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('id') id: string,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates

    const existingCase = await this.findCaseById(id)

    const user = await this.findUserByNationalId(transition.nationalId)

    const update = transitionCase(transition, existingCase, user)

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      update,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${id}`,
      )
    }

    return updatedCase
  }

  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(): Promise<Case[]> {
    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  async getById(@Param('id') id: string): Promise<Case> {
    return this.findCaseById(id)
  }

  @Post('case/:id/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('id') id: string,
    @Res() res,
  ): Promise<SigningServiceResponse> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.ACCEPTED &&
      existingCase.state !== CaseState.REJECTED
    ) {
      throw new ForbiddenException(
        `Cannot sign a ruling for a case in state ${existingCase.state}`,
      )
    }

    if (!existingCase.judge) {
      throw new ForbiddenException('A ruling must be signed by a judge')
    }

    try {
      const response = await this.caseService.requestSignature(existingCase)
      return res.status(201).send(response)
    } catch (error) {
      if (error instanceof DokobitError) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
        })
      }

      throw error
    }
  }

  @Get('case/:id/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested signature for an existing case',
  })
  async getSignatureConfirmation(
    @Param('id') id: string,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.ACCEPTED &&
      existingCase.state !== CaseState.REJECTED
    ) {
      throw new ForbiddenException(
        `Cannot confirm a ruling signature for a case in state ${existingCase.state}`,
      )
    }

    return this.caseService.getSignatureConfirmation(
      existingCase,
      documentToken,
    )
  }
}
