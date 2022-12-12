import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { XRoadConfig, ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { IdentityDocumentApi, PreregistrationApi } from '../../gen/fetch'
import {
  IdentityDocument,
  IdentityDocumentChild,
  Passport,
  PreregistrationInput,
} from './passportsApi.types'
import { mapChildPassports, mapPassports } from './passportsApi.utils'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'
import { uuid } from 'uuidv4'
import { defaultDeliveryAddress } from './constants'

@Injectable()
export class PassportsService {
  constructor(
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private identityDocumentApi: IdentityDocumentApi,
    private preregistrationApi: PreregistrationApi,
    private individualApi: NationalRegistryClientService,
  ) {}

  async getPassports(user: User): Promise<IdentityDocument[]> {
    const identityDocuments = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
    return identityDocuments.map(mapPassports)
  }

  async getChildPassports(user: User): Promise<IdentityDocumentChild[]> {
    const identityDocuments: IdentityDocumentChild[] = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetChildrenIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
      .then((res) =>
        res.filter((child) => !!child.childrenSSN).map(mapChildPassports),
      )

    const children = await Promise.all(
      identityDocuments?.map(
        async (passports): Promise<IdentityDocumentChild> => {
          const individual = await this.individualApi.getIndividual(
            passports.nationalId,
          )
          return {
            ...passports,
            name: individual?.name,
          } as IdentityDocumentChild
        },
      ),
    )

    return children
  }

  async preregisterIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<string[]> {
    const approval = { personId: '', approved: new Date() }

    return await this.preregistrationApi
      .withMiddleware(new AuthMiddleware(user))
      .preregistrationPreregistration({
        xRoadClient: this.xroadConfig.xRoadClient,
        preregistration: {
          ...input,
          guId: uuid(),
          approvalA: approval,
          approvalB: approval,
          deliveryAddress: defaultDeliveryAddress,
          bioInfo: { height: 0 },
          documents: [],
        },
      })
  }

  async preregisterChildIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<string[]> {
    const { appliedForPersonId, approvalA, approvalB } = input
    const pdfBuffer = await this.createDocumentBuffer({
      appliedForPersonId,
      approvalA,
      approvalB,
    })
    const pdfDoc = Buffer.from(pdfBuffer).toString('base64')
    return await this.preregistrationApi
      .withMiddleware(new AuthMiddleware(user))
      .preregistrationPreregistration({
        xRoadClient: this.xroadConfig.xRoadClient,
        preregistration: {
          ...input,
          bioInfo: { height: 0 },
          deliveryAddress: defaultDeliveryAddress,
          documents: [
            {
              name: 'samþykki',
              documentType: 'pdf',
              contentType: 'base64',
              content: pdfDoc,
            },
          ],
        },
      })
  }

  async getCurrentPassport(user: User): Promise<Passport> {
    const userPassports = await this.getPassports(user)
    const childPassports = await this.getChildPassports(user)
    const userPassport: IdentityDocument | null =
      userPassports
        .filter(
          (passport) => passport.subType === 'A' && !!passport.expirationDate,
        )
        .sort(
          (a, b) => b?.expirationDate.getDate() - a.expirationDate.getDate(),
        )
        .pop() || null

    return {
      userPassport: userPassport || undefined,
      childPassports: childPassports,
    }
  }

  async createDocumentBuffer({
    appliedForPersonId,
    approvalA,
    approvalB,
  }: Pick<
    PreregistrationInput,
    'appliedForPersonId' | 'approvalA' | 'approvalB'
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
      .text('Umsókn um vegabréf með samþykki forsjáraðila fyrir hönd: ')
      .text(appliedForPersonId ?? '')
      .moveDown()

      .fontSize(regular)
      .font(fontBold)
      .text(
        'Samþykki forráðamanna liggur fyrir og er staðfest gegnum island.is.',
      )
      .moveDown()

      .font(fontBold)
      .text('Forsjáraðila A: ')
      .font(fontRegular)
      .text(`${approvalA?.personId}, ${approvalA?.approved}`)
      .moveDown()

      .font(fontBold)
      .text('Forsjáraðila B: ')
      .font(fontRegular)
      .text(`${approvalB?.personId}, ${approvalB?.approved}`)
      .moveDown()

      .font(fontRegular)
      .text('Með kveðju frá island.is')

      .moveDown()
      .text(
        'Þetta skjal var framkallað sjálfvirkt þann: ' +
          new Date().toLocaleDateString(locale),
      )
    doc.end()
    return await getStream.buffer(doc)
  }
}
