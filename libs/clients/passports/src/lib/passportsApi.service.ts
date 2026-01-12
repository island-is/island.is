import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import {
  DeliveryAddressApi,
  IdentityDocumentApi,
  IdentityDocumentResponse,
  PreregistrationApi,
  DocumentLossApi,
} from '../../gen/fetch'
import {
  DocumentLossnInput,
  Gender,
  IdentityDocument,
  IdentityDocumentChild,
  Passport,
  DeliveryAddress,
  PreregisterResponse,
  PreregistrationInput,
  IdentityDocumentTypes,
  PassportsCollection,
} from './passportsApi.types'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'
import { PassThrough } from 'stream'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import isBefore from 'date-fns/isBefore'
import differenceInMonths from 'date-fns/differenceInMonths'
import { ExpiryStatus } from './passportsApi.types'
import { format as formatNationalId } from 'kennitala'

const LOG_CATEGORY = 'passport-service'

@Injectable()
export class PassportsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private identityDocumentApi: IdentityDocumentApi,
    private preregistrationApi: PreregistrationApi,
    private documentLossApi: DocumentLossApi,
    private deliveryAddressApi: DeliveryAddressApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Domain passport error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private getPassportsWithAuth(auth: Auth) {
    return this.identityDocumentApi.withMiddleware(new AuthMiddleware(auth))
  }

  private resolvePassports(passportData: IdentityDocumentResponse[]) {
    const passportArray = passportData.map((passport) => {
      /**
       * Expiration status: string
       *    if invalid and expirationDate has passed: EXPIRED (ÚTRUNNIÐ)
       *    if invalid and expirationDate has NOT passed: LOST (GLATAÐ)
       *    else undefined
       */
      const invalidPassport = passport.status?.toLowerCase() === 'invalid'
      let expiryStatus: ExpiryStatus | undefined = undefined
      if (invalidPassport && passport.expirationDate) {
        const expirationDatePassed = isBefore(
          new Date(passport.expirationDate),
          new Date(),
        )

        const expired = invalidPassport && expirationDatePassed
        expiryStatus = expired ? 'EXPIRED' : 'LOST'
      }

      /**
       * Expires within notice time: boolean
       * Does the passport expire within 6 months or less from today
       */
      let expiresWithinNoticeTime = undefined
      if (passport.expirationDate) {
        expiresWithinNoticeTime =
          differenceInMonths(new Date(passport.expirationDate), new Date()) < 6
      }

      /**
       * Passportnumber as displayed on icelandic passports.
       * With subtype in front.
       */
      const numberWithType =
        passport.subType && passport.number
          ? `${passport.subType}${passport.number}`
          : undefined

      return {
        ...passport,
        numberWithType,
        sex: passport.sex as Gender,
        expiryStatus,
        expiresWithinNoticeTime,
      }
    })

    if (Array.isArray(passportArray) && passportArray.length === 0) {
      this.logger.debug(`${LOG_CATEGORY}: No active passport`)
    }

    return passportArray
  }

  async getIdentityDocument(
    auth: User,
    type?: IdentityDocumentTypes,
  ): Promise<IdentityDocument[] | undefined> {
    try {
      const passportResponse = await this.getPassportsWithAuth(
        auth,
      ).identityDocumentGetIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
        type,
      })
      const identityDocumentResponse = this.resolvePassports(passportResponse)

      return identityDocumentResponse
    } catch (e) {
      this.handleError(e)
    }
  }

  async getIdentityDocumentChildren(
    auth: User,
    type?: IdentityDocumentTypes,
  ): Promise<IdentityDocumentChild[] | undefined> {
    try {
      const passportResponse = await this.getPassportsWithAuth(
        auth,
      ).identityDocumentGetChildrenIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
        type,
      })

      const childrenArray = passportResponse.map((child) => {
        return {
          childNationalId: child.childrenSSN,
          childName: child.childrenName,
          secondParent: child.secondParent,
          secondParentName: child.secondParentName,
          passports: child.identityDocumentResponses
            ? this.resolvePassports(child.identityDocumentResponses)
            : undefined,
          citizenship: child.rikisfang,
        }
      })

      return childrenArray
    } catch (e) {
      this.handleError(e)
    }
  }

  async getDeliveryAddress(user: User): Promise<DeliveryAddress[]> {
    const response = await this.deliveryAddressApi
      .withMiddleware(new AuthMiddleware(user))
      .deliveryAddressGetLookupTables({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
    return response as DeliveryAddress[]
  }

  async preregisterIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<PreregisterResponse> {
    try {
      const res = await this.preregistrationApi
        .withMiddleware(new AuthMiddleware(user))
        .preregistrationPreregistration({
          xRoadClient: this.xroadConfig.xRoadClient,
          preregistration: input,
        })
      return { success: !!res }
    } catch (e) {
      this.handleError(e)
      return { success: false }
    }
  }

  async preregisterChildIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<PreregisterResponse> {
    try {
      const { appliedForPersonId, approvalA, approvalB, guid } = input
      const pdfBuffer = await this.createDocumentBuffer({
        guid,
        appliedForPersonId,
        approvalA,
        approvalB,
      })
      const pdfDoc = Buffer.from(pdfBuffer).toString('base64')
      const res = await this.preregistrationApi
        .withMiddleware(new AuthMiddleware(user))
        .preregistrationPreregistration({
          xRoadClient: this.xroadConfig.xRoadClient,
          preregistration: {
            ...input,
            documents: [
              {
                name: 'samþykki',
                documentType: 'PDF',
                contentType: 'CUSTODIAN_APPROVAL',
                dataSpecification: 'CUST_APPROV_IS',
                content: pdfDoc,
              },
            ],
          },
        })
      return { success: !!res }
    } catch (e) {
      this.handleError(e)
      return { success: false }
    }
  }

  async getAllIdentityDocuments(
    user: User,
    type?: IdentityDocumentTypes,
  ): Promise<PassportsCollection> {
    const [userPassports, childPassports] = await Promise.all([
      this.getIdentityDocument(user, type),
      this.getIdentityDocumentChildren(user, type),
    ])

    return {
      userPassports: userPassports ?? [],
      childPassports: childPassports ?? [],
    }
  }

  async getCurrentPassport(
    user: User,
    type?: IdentityDocumentTypes,
  ): Promise<Passport> {
    const userPassports = await this.getIdentityDocument(user, type)
    const childPassports = await this.getIdentityDocumentChildren(user, type)

    const userPassport = userPassports
      ? userPassports.sort((a, b) =>
          a?.expirationDate && b?.expirationDate
            ? Number(b.expirationDate) - Number(a.expirationDate)
            : 0,
        )[0]
      : undefined

    return {
      userPassport,
      childPassports: childPassports,
    }
  }

  async annulPassport(
    user: User,
    input: DocumentLossnInput,
  ): Promise<PreregisterResponse> {
    const res = await this.documentLossApi
      .withMiddleware(new AuthMiddleware(user))
      .documentLossDocumentLoss({
        xRoadClient: this.xroadConfig.xRoadClient,
        documentLossAnnouncementRequest: {
          ...input,
          announcedByPersonId: user.nationalId,
          incidentDate: new Date().toISOString(),
        },
      })
    return { success: !!res }
  }

  async createDocumentBuffer({
    guid,
    appliedForPersonId,
    approvalA,
    approvalB,
  }: Pick<
    PreregistrationInput,
    'guid' | 'appliedForPersonId' | 'approvalA' | 'approvalB'
  >) {
    // build pdf
    const doc = new PDFDocument()
    const locale = 'is-IS'
    const big = 16
    const regular = 8
    const fontRegular = 'Helvetica'
    const fontBold = 'Helvetica-Bold'

    doc
      .fontSize(big)
      .text(
        'Rafrænt samþykki vegna útgáfu vegabréfs fyrir einstakling undir 18 ára aldri ',
      )
      .moveDown()

      .fontSize(regular)
      .font(fontBold)
      .text('Sótt er um fyrir: ')
      .moveDown()

      .font(fontRegular)
      .text(
        `Kenntiala: ${
          appliedForPersonId ? formatNationalId(appliedForPersonId) : ''
        }`,
      )
      .moveDown()

      .fontSize(regular)
      .font(fontBold)
      .text(
        'Samþykki forráðamanna liggur fyrir og er staðfest gegnum island.is.',
      )
      .moveDown()

      .font(fontBold)
      .text('Forsjáraðili: ')
      .font(fontRegular)
      .text(`Nafn: ${approvalA?.name}`)
      .text(
        `Kenntiala: ${approvalA ? formatNationalId(approvalA?.personId) : ''}`,
      )
      .text(`Dagsetning: ${approvalA?.approved}`)
      .moveDown()

      .font(fontBold)
      .text('Forsjáraðili: ')
      .font(fontRegular)
      .text(`Nafn: ${approvalB?.name}`)
      .text(
        `Kenntiala: ${approvalB ? formatNationalId(approvalB?.personId) : ''}`,
      )
      .text(`Dagsetning: ${approvalB?.approved}`)
      .moveDown()

      .moveDown()
      .text(
        'Þetta skjal var framkallað með sjálfvirkum hætti á island.is þann:' +
          new Date().toLocaleDateString(locale),
      )

      .moveDown()
      .text('guId: ' + guid)

    const stream = new PassThrough()
    doc.pipe(stream)
    doc.end()
    return await getStream.buffer(stream)
  }
}
