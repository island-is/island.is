import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { IntlService } from '@island.is/cms-translations'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  getRequestPdfAsBuffer,
  getRequestPdfAsString,
  getRulingPdfAsString,
  getCasefilesPdfAsString,
  writeFile,
  getCustodyNoticePdfAsString,
} from '../../formatters'
import { Institution } from '../institution'
import { User } from '../user'
import { CourtService } from '../court'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { getCasesQueryFilter, isCaseBlockedFromUser } from './filters'
import { Case, SignatureConfirmationResponse } from './models'
import { Includeable } from 'sequelize/types'

interface Recipient {
  name: string
  address: string
}

const standardIncludes: Includeable[] = [
  {
    model: Institution,
    as: 'court',
  },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase' },
  { model: Case, as: 'childCase' },
]

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async uploadSignedRulingPdfToCourt(
    existingCase: Case,
    pdf: string,
  ): Promise<boolean> {
    // TODO: Find a better place for this
    try {
      if (existingCase.caseFiles && existingCase.caseFiles.length > 0) {
        this.logger.debug(
          `Uploading case files overview pdf to court for case ${existingCase.id}`,
        )

        const caseFilesPdf = await getCasefilesPdfAsString(existingCase)

        if (!environment.production) {
          writeFile(`${existingCase.id}-case-files.pdf`, caseFilesPdf)
        }

        const buffer = Buffer.from(caseFilesPdf, 'binary')

        const streamId = await this.courtService.uploadStream(
          existingCase.courtId,
          'Rannsóknargögn.pdf',
          'application/pdf',
          buffer,
        )
        await this.courtService.createDocument(
          existingCase.courtId,
          existingCase.courtCaseNumber,
          'Rannsóknargögn',
          'Rannsóknargögn.pdf',
          streamId,
        )
      }
    } catch (error) {
      // Log and ignore this error. The overview is not that critical.
      this.logger.error(
        `Failed to upload case files overview pdf to court for case ${existingCase.id}`,
        error,
      )
    }

    this.logger.debug(
      `Uploading signed ruling pdf to court for case ${existingCase.id}`,
    )

    const buffer = Buffer.from(pdf, 'binary')

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        'Þingbók og úrskurður.pdf',
        'application/pdf',
        buffer,
      )
      await this.courtService.createThingbok(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        streamId,
      )

      return true
    } catch (error) {
      this.logger.error(
        `Failed to upload signed ruling pdf to court for case ${existingCase.id}`,
        error,
      )

      return false
    }
  }

  private async sendEmail(
    to: Recipient | Recipient[],
    courtCaseNumber: string | undefined,
    signedRulingPdf: string,
    body: string,
  ) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        replyTo: {
          name: environment.email.replyToName,
          address: environment.email.replyToEmail,
        },
        to,
        subject: `Úrskurður í máli ${courtCaseNumber}`,
        text: body,
        html: body,
        attachments: [
          {
            filename: `Þingbók og úrskurður ${courtCaseNumber}.pdf`,
            content: signedRulingPdf,
            encoding: 'binary',
          },
        ],
      })
    } catch (error) {
      this.logger.error('Failed to send email', error)
    }
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    const uploaded =
      existingCase.courtId &&
      existingCase.courtCaseNumber &&
      IntegratedCourts.includes(existingCase.courtId)
        ? await this.uploadSignedRulingPdfToCourt(existingCase, signedRulingPdf)
        : false

    const promises = [
      this.sendEmail(
        {
          name: existingCase.prosecutor?.name ?? '',
          address: existingCase.prosecutor?.email ?? '',
        },
        existingCase.courtCaseNumber,
        signedRulingPdf,
        `${existingCase.court?.name} hefur sent þér endurrit úr þingbók í máli ${existingCase.courtCaseNumber} ásamt úrskurði dómara í heild sinni í meðfylgjandi viðhengi.`,
      ),
    ]

    if (!uploaded) {
      promises.push(
        this.sendEmail(
          [
            {
              name: existingCase.registrar?.name ?? '',
              address: existingCase.registrar?.email ?? '',
            },
            {
              name: existingCase.judge?.name ?? '',
              address: existingCase.judge?.email ?? '',
            },
          ],
          existingCase.courtCaseNumber,
          signedRulingPdf,
          'Ekki tókst að vista meðfylgjandi skjal í Auði.',
        ),
      )
    }

    if (
      existingCase.defenderEmail &&
      (isRestrictionCase(existingCase.type) ||
        existingCase.sessionArrangements === SessionArrangements.ALL_PRESENT)
    ) {
      promises.push(
        this.sendEmail(
          {
            name: existingCase.defenderName ?? '',
            address: existingCase.defenderEmail,
          },
          existingCase.courtCaseNumber,
          signedRulingPdf,
          `${existingCase.court?.name} hefur sent þér endurrit úr þingbók í máli ${existingCase.courtCaseNumber} ásamt úrskurði dómara í heild sinni í meðfylgjandi viðhengi.`,
        ),
      )
    }

    await Promise.all(promises)
  }

  async findById(
    id: string,
    additionalIncludes: Includeable[] = [],
  ): Promise<Case | null> {
    this.logger.debug(`Finding case ${id}`)

    const include = standardIncludes.concat(additionalIncludes)

    return this.caseModel.findOne({
      where: { id },
      include,
    })
  }

  async getAll(user: TUser): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['created', 'DESC']],
      where: getCasesQueryFilter(user),
      include: standardIncludes,
    })
  }

  async findByIdAndUser(
    id: string,
    user: TUser,
    forUpdate = true,
    additionalIncludes: Includeable[] = [],
  ): Promise<Case> {
    const existingCase = await this.findById(id, additionalIncludes)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    if (isCaseBlockedFromUser(existingCase, user, forUpdate)) {
      throw new ForbiddenException(
        `User ${user.id} does not have${
          forUpdate ? ' update' : ' read'
        } access to case ${id}`,
      )
    }

    return existingCase
  }

  async create(caseToCreate: CreateCaseDto, user?: TUser): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create({
      ...caseToCreate,
      creatingProsecutorId: user?.id,
      prosecutorId: user?.id,
    })
  }

  async update(
    id: string,
    update: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case ${id}`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  async getRequestPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the request for case ${existingCase.id} as a pdf document`,
    )

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    return getRequestPdfAsString(existingCase, intl.formatMessage)
  }

  async getRulingPdf(
    existingCase: Case,
    shortversion = false,
  ): Promise<string> {
    this.logger.debug(
      `Getting the ruling for case ${existingCase.id} as a pdf document`,
    )

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    return getRulingPdfAsString(existingCase, intl.formatMessage, shortversion)
  }

  async getCustodyPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the custody notice for case ${existingCase.id} as a pdf document`,
    )

    return getCustodyNoticePdfAsString(existingCase)
  }

  async requestSignature(existingCase: Case): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      const intl = await this.intlService.useIntl(
        ['judicial.system.backend'],
        'is',
      )

      const pdf = await getRulingPdfAsString(existingCase, intl.formatMessage)

      return this.signingService.requestSignature(
        existingCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        existingCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async getSignatureConfirmation(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should be called immediately after requestSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(existingCase, signedPdf)
      } catch (error) {
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
    await this.update(existingCase.id, {
      rulingDate: new Date(),
    } as UpdateCaseDto)

    return {
      documentSigned: true,
    }
  }

  async extend(existingCase: Case, user: TUser): Promise<Case> {
    this.logger.debug(`Extending case ${existingCase.id}`)

    return this.caseModel.create({
      type: existingCase.type,
      policeCaseNumber: existingCase.policeCaseNumber,
      description: existingCase.description,
      accusedNationalId: existingCase.accusedNationalId,
      accusedName: existingCase.accusedName,
      accusedAddress: existingCase.accusedAddress,
      accusedGender: existingCase.accusedGender,
      courtId: existingCase.courtId,
      lawsBroken: existingCase.lawsBroken,
      legalBasis: existingCase.legalBasis,
      legalProvisions: existingCase.legalProvisions,
      requestedCustodyRestrictions: existingCase.requestedCustodyRestrictions,
      caseFacts: existingCase.caseFacts,
      legalArguments: existingCase.legalArguments,
      requestProsecutorOnlySession: existingCase.requestProsecutorOnlySession,
      prosecutorOnlySessionRequest: existingCase.prosecutorOnlySessionRequest,
      creatingProsecutorId: user.id,
      prosecutorId: user.id,
      parentCaseId: existingCase.id,
    })
  }

  async uploadRequestPdfToCourt(id: string): Promise<void> {
    this.logger.debug(`Uploading request pdf to court for case ${id}`)

    const existingCase = (await this.findById(id)) as Case

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    const pdf = await getRequestPdfAsBuffer(existingCase, intl.formatMessage)

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        'Krafa.pdf',
        'application/pdf',
        pdf,
      )
      await this.courtService.createRequest(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        'Krafa',
        'Krafa.pdf',
        streamId,
      )
    } catch (error) {
      this.logger.error(
        `Failed to upload request pdf to court for case ${id}`,
        error,
      )
    }
  }
}
