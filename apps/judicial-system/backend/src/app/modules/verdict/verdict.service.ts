import { Transaction } from 'sequelize'

import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { type User as TUser } from '@island.is/judicial-system/types'

import { Case, PdfService } from '../case'
import { Defendant } from '../defendant'
import { PoliceService } from '../police'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { UpdateVerdictExternalPoliceDocumentIdDto } from './dto/updateVerdictExternalPoliceDocumentId.dto'
import { DeliverResponse } from './models/deliver.response'
import { Verdict } from './models/verdict.model'

export class VerdictService {
  constructor(
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    private readonly pdfService: PdfService,
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
    // Step 1: get verdictPDF or might it be word?
    // TODO

    // deliver the verdict by creating the document at the polcie
    const normalizedNationalId = normalizeAndFormatNationalId(
      defendant.nationalId,
    )[0]
    const documentName = `Dómur í máli ${theCase.courtCaseNumber} - kt: ${normalizedNationalId}`
    const createdDocument = await this.policeService.createDocument({
      caseId: theCase.id,
      defendantId: defendant.id,
      user,
      documentName,
      documentsBase64: [], // TODO
      fileTypeCode: 'BRTNG_DOMUR',
    })
    if (!createdDocument) {
      this.logger.error('Failed to create document verdict file for police')
      return { delivered: false }
    }

    // update existing verdict with the external document id returned from the police
    await this.update(verdict.id, createdDocument)

    return { delivered: true }
  }
}
