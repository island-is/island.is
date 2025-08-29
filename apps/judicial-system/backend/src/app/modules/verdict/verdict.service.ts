import { Base64 } from 'js-base64'
import { Sequelize, Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  type User as TUser,
} from '@island.is/judicial-system/types'
import { ServiceRequirement } from '@island.is/judicial-system/types'

import { FileService } from '../file'
import { PoliceService } from '../police'
import { Case, Defendant, Verdict } from '../repository'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { DeliverResponse } from './models/deliver.response'

type UpdateVerdict = { serviceDate?: Date | null } & Pick<
  Verdict,
  | 'externalPoliceDocumentId'
  | 'serviceRequirement'
  | 'servedBy'
  | 'appealDecision'
  | 'appealDate'
  | 'serviceInformationForDefendant'
>

export class VerdictService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    verdictId: string,
    transaction?: Transaction,
  ): Promise<Verdict> {
    const verdict = await this.verdictModel.findOne({
      where: { id: verdictId },
      transaction,
    })

    if (!verdict) {
      throw new NotFoundException(`Verdict ${verdictId} does not exist`)
    }

    return verdict
  }

  async createVerdict(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
  ): Promise<Verdict> {
    return this.verdictModel.create({ defendantId, caseId }, { transaction })
  }

  private async handleServiceRequirementUpdate(
    verdictId: string,
    update: UpdateVerdictDto,
    transaction: Transaction,
    rulingDate?: Date,
  ): Promise<UpdateVerdictDto> {
    // rulingDate should be set, but the case completed guard can not guarantee its presence
    // ensure that ruling date is present to prevent side effects in handle service requirement update
    if (!rulingDate) {
      throw new BadRequestException(
        'Missing rulingDate for service requirement update',
      )
    }

    if (!update.serviceRequirement) {
      return update
    }

    const currentVerdict = await this.findById(verdictId, transaction)

    // prevent updating service requirement AGAIN after a verdict has been served by police and potentially override the service date
    if (
      currentVerdict.serviceRequirement === ServiceRequirement.REQUIRED &&
      currentVerdict.serviceDate
    ) {
      throw new BadRequestException(
        `Cannot update service requirement to ${update.serviceRequirement} - verdict ${verdictId} has already be served`,
      )
    }
    // in case of repeated update, we ensure that service date is not set for specific service requirements
    return {
      ...update,
      ...(update.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
        ? { serviceDate: rulingDate }
        : { serviceDate: null }),
    }
  }

  private async updateVerdict(
    verdict: Verdict,
    update: UpdateVerdict,
    transaction?: Transaction,
  ): Promise<Verdict> {
    const [numberOfAffectedRows, updatedVerdict] =
      await this.verdictModel.update(update, {
        where: { id: verdict.id },
        returning: true,
        transaction,
      })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating verdict`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update verdict ${verdict.id}`,
      )
    }

    return updatedVerdict[0]
  }

  async update(
    verdict: Verdict,
    update: UpdateVerdictDto,
    rulingDate?: Date,
  ): Promise<Verdict> {
    return this.sequelize.transaction(async (transaction) => {
      const enhancedUpdate = await this.handleServiceRequirementUpdate(
        verdict.id,
        update,
        transaction,
        rulingDate,
      )

      return this.updateVerdict(verdict, enhancedUpdate, transaction)
    })
  }

  async updateRestricted(
    verdict: Verdict,
    update: InternalUpdateVerdictDto,
  ): Promise<Verdict> {
    const updatedVerdict = await this.updateVerdict(verdict, update)
    return updatedVerdict
  }

  async deliverVerdictToNationalCommissionersOffice(
    theCase: Case,
    defendant: Defendant,
    verdict: Verdict,
    user: TUser,
  ): Promise<DeliverResponse> {
    // get verdict file
    const verdictFile = theCase.caseFiles?.find(
      (caseFile) => caseFile.category === CaseFileCategory.RULING,
    )

    if (!verdictFile) {
      throw new NotFoundException(
        `Ruling file not found for case ${theCase.id}`,
      )
    }

    const verdictPdf = await this.fileService.getCaseFileFromS3(
      theCase,
      verdictFile,
    )

    const normalizedNationalId = normalizeAndFormatNationalId(
      defendant.nationalId,
    )[0]
    const documentName = `Dómur í máli ${theCase.courtCaseNumber}`

    // deliver the verdict by creating the document at the police
    // TODO: Adjust the document in collaboration with RLS
    const createdDocument = await this.policeService.createDocument({
      caseId: theCase.id,
      defendantId: defendant.id,
      defendantNationalId: normalizedNationalId,
      user,
      documentName,
      documentFiles: [
        {
          name: verdictFile.name,
          documentBase64: Base64.btoa(verdictPdf.toString('binary')),
        },
      ],
      documentDates: [{ code: 'ORDER_BY_DATE', value: verdictFile.created }],
      fileTypeCode: 'BRTNG_DOMUR',
    })
    if (!createdDocument) {
      return { delivered: false }
    }
    // update existing verdict with the external document id returned from the police
    await this.updateVerdict(verdict, createdDocument)

    return { delivered: true }
  }
}
