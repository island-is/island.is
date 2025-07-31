import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  type User as TUser,
} from '@island.is/judicial-system/types'
import { ServiceRequirement } from '@island.is/judicial-system/types'

import { Case } from '../case'
import { Defendant } from '../defendant'
import { FileService } from '../file'
import { PoliceService } from '../police'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { DeliverResponse } from './models/deliver.response'
import { Verdict } from './models/verdict.model'

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
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async update(verdictId: string, update: UpdateVerdict) {
    const [numberOfAffectedRows, updatedVerdict] =
      await this.verdictModel.update(update, {
        where: { id: verdictId },
        returning: true,
      })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating verdict`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update verdict ${verdictId}`,
      )
    }

    return updatedVerdict[0]
  }

  async findById(verdictId: string): Promise<Verdict> {
    const verdict = await this.verdictModel.findOne({
      where: { id: verdictId },
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

  async handleServiceRequirementUpdate(
    verdictId: string,
    update: UpdateVerdictDto,
    rulingDate?: Date,
  ): Promise<UpdateVerdictDto> {
    if (!update.serviceRequirement) {
      return update
    }

    const currentVerdict = await this.findById(verdictId)

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

  async updateVerdict(
    verdict: Verdict,
    update: UpdateVerdictDto,
  ): Promise<Verdict> {
    const updatedVerdict = await this.update(verdict.id, update)
    return updatedVerdict
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
    await this.update(verdict.id, createdDocument)

    return { delivered: true }
  }
}
