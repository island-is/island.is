import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'

import {
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

import { Case } from '../case'
import { Defendant } from '../defendant'
import { FileService } from '../file'
import { PoliceService } from '../police'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { UpdateVerdictExternalPoliceDocumentIdDto } from './dto/updateVerdictExternalPoliceDocumentId.dto'
import { DeliverResponse } from './models/deliver.response'
import { Verdict } from './models/verdict.model'

export class VerdictService {
  constructor(
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async update(
    verdictId: string,
    update: UpdateVerdictDto | UpdateVerdictExternalPoliceDocumentIdDto,
  ) {
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

    // deliver the verdict by creating the document at the police
    const normalizedNationalId = normalizeAndFormatNationalId(
      defendant.nationalId,
    )[0]
    const documentName = `Dómur í máli ${theCase.courtCaseNumber} - kt: ${normalizedNationalId}`

    const createdDocument = await this.policeService.createDocument({
      caseId: theCase.id,
      defendantId: defendant.id,
      user,
      documentName,
      documentsBase64: [Base64.btoa(verdictPdf.toString('binary'))],
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
