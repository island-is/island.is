import { Sequelize } from 'sequelize-typescript'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CaseOrigin, UserRole } from '@island.is/judicial-system/types'

import { UserService } from '../user'
import { DefendantService } from '../defendant'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { Case } from './models/case.model'
import { CaseService } from './case.service'

@Injectable()
export class InternalCaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    private readonly userService: UserService,
    private readonly defendantService: DefendantService,
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined
    let courtId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${
            prosecutor?.id ?? 'unknown'
          } is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
      courtId = prosecutor.institution?.defaultCourtId
    }

    return this.sequelize.transaction(async (transaction) => {
      const theCase = await this.caseModel.create(
        {
          ...caseToCreate,
          origin: CaseOrigin.LOKE,
          creatingProsecutorId: prosecutorId,
          prosecutorId,
          courtId,
        },
        { transaction },
      )

      await this.defendantService.create(
        theCase.id,
        {
          nationalId: caseToCreate.accusedNationalId,
          name: caseToCreate.accusedName,
          gender: caseToCreate.accusedGender,
          address: caseToCreate.accusedAddress,
        },
        transaction,
      )

      return this.caseService.findById(theCase.id)
    })
  }
}
