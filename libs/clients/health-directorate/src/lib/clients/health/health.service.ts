import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  DispensationDto,
  Locale,
  MeDispensationsApi,
  MePrescriptionsApi,
  MeReferralsApi,
  MeWaitingListsApi,
  PrescribedItemDto,
  PrescribedItemDtoRenewalBlockedReasonEnum,
  PrescribedItemDtoRenewalStatusEnum,
  ReferralDto,
  WaitingListEntryDto,
} from './gen/fetch'

const LOG_CATEGORY = 'health-directorate-health-api'

@Injectable()
export class HealthDirectorateHealthService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly referralsApi: MeReferralsApi,
    private readonly waitingListsApi: MeWaitingListsApi,
    private readonly dispensationsApi: MeDispensationsApi,
    private readonly prescriptionsApi: MePrescriptionsApi,
  ) {}

  private referralsApiWithAuth(auth: Auth) {
    return this.referralsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private waitingListsApiWithAuth(auth: Auth) {
    return this.waitingListsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private dispensationsApiWithAuth(auth: Auth) {
    return this.dispensationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private prescriptionsApiWithAuth(auth: Auth) {
    return this.prescriptionsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mapLocale(locale: string): Locale {
    return locale === 'is' ? Locale.Is : Locale.En
  }

  /* Afgreiðslur */
  private async getDispensations(
    auth: Auth,
    atcCode: string,
  ): Promise<Array<DispensationDto> | null> {
    const dispensations = await this.dispensationsApiWithAuth(auth)
      .meDispensationControllerGetDispensationsForAtcCodeV1({ atcCode })
      .catch(handle404)

    if (!dispensations) {
      this.logger.debug(`No dispensations returned for atc code: ${atcCode}`, {
        category: LOG_CATEGORY,
      })
      return null
    }

    return dispensations
  }

  public async getPrescriptions(
    auth: Auth,
    locale: string,
  ): Promise<Array<PrescribedItemDto> | null> {
    const prescriptions: PrescribedItemDto[] = [
      {
        prescribedItemId: 2,
        prescriptionId: 2,
        prescriberId: '2',
        prescriberName: 'Dr. Jane Smith' as unknown as object,
        issueDate: new Date('2023-02-01'),
        expiryDate: new Date('2023-11-30'),
        productId: '2',
        productName: 'Ibuprofen' as unknown as object,
        productType: 'Capsule' as unknown as object,
        productForm: 'Oral' as unknown as object,
        productUrl: 'http://example.com/product/2' as unknown as object,
        productStrength: '200mg' as unknown as object,
        productQuantity: '20' as unknown as object,
        dosageInstructions:
          'Take one capsule every 8 hours' as unknown as object,
        indication: 'Inflammation' as unknown as object,
        totalPrescribedAmount: '20' as unknown as object,
        totalPrescribedAmountDisplay: '20 capsules' as unknown as object,
        isRegiment: false as unknown as object,
        isRenewable: true,
        renewalBlockedReason:
          PrescribedItemDtoRenewalBlockedReasonEnum.IsRegiment,
        renewalStatus: PrescribedItemDtoRenewalStatusEnum.NUMBER_0,
        amountRemaining: 15,
        amountRemainingUnit: 'capsules',
        amountRemainingDisplay: '15 capsules',
        percentageRemaining: 75,
        isFullyDispensed: false,
        dispensations: [
          {
            id: 3,
            dispensingAgentId: 2,
            dispensingAgentName: 'Pharmacy B',
            dispensationDate: new Date(),
            dispensedItemsCount: 5,
            dispensedItems: [
              {
                productId: '2',
                productName: 'Ibuprofen' as unknown as object,
                productStrength: '200mg' as unknown as object,
                dispensedAmount: '5' as unknown as object,
                dispensedAmountDisplay: '5 capsules' as unknown as object,
                numberOfPackages: '1' as unknown as object,
              },
            ],
          },
        ],
      },
      {
        prescribedItemId: 3,
        prescriptionId: 3,
        prescriberId: '3',
        prescriberName: 'Dr. Emily Johnson' as unknown as object,
        issueDate: new Date('2023-03-01'),
        expiryDate: new Date('2023-10-31'),
        productId: '3',
        productName: 'Amoxicillin' as unknown as object,
        productType: 'Tablet' as unknown as object,
        productForm: 'Oral' as unknown as object,
        productUrl: 'http://example.com/product/3' as unknown as object,
        productStrength: '500mg' as unknown as object,
        productQuantity: '40' as unknown as object,
        dosageInstructions:
          'Take one tablet every 12 hours' as unknown as object,
        indication: 'Bacterial infection' as unknown as object,
        totalPrescribedAmount: '40' as unknown as object,
        totalPrescribedAmountDisplay: '40 tablets' as unknown as object,
        isRegiment: false as unknown as object,
        isRenewable: true,
        renewalBlockedReason:
          PrescribedItemDtoRenewalBlockedReasonEnum.IsRegiment,
        renewalStatus: PrescribedItemDtoRenewalStatusEnum.NUMBER_0,
        amountRemaining: 30,
        amountRemainingUnit: 'tablets',
        amountRemainingDisplay: '30 tablets',
        percentageRemaining: 75,
        isFullyDispensed: false,
        dispensations: [
          {
            id: 4,
            dispensingAgentId: 3,
            dispensingAgentName: 'Pharmacy C',
            dispensationDate: new Date(),
            dispensedItemsCount: 10,
            dispensedItems: [
              {
                productId: '3',
                productName: 'Amoxicillin' as unknown as object,
                productStrength: '500mg' as unknown as object,
                dispensedAmount: '10' as unknown as object,
                dispensedAmountDisplay: '10 tablets' as unknown as object,
                numberOfPackages: '1' as unknown as object,
              },
              {
                productId: '3',
                productName: 'Amoxicillin' as unknown as object,
                productStrength: '500mg' as unknown as object,
                dispensedAmount: '10' as unknown as object,
                dispensedAmountDisplay: '10 tablets' as unknown as object,
                numberOfPackages: '1' as unknown as object,
              },
              {
                productId: '3',
                productName: 'Amoxicillin' as unknown as object,
                productStrength: '500mg' as unknown as object,
                dispensedAmount: '10' as unknown as object,
                dispensedAmountDisplay: '10 tablets' as unknown as object,
                numberOfPackages: '1' as unknown as object,
              },
              {
                productId: '3',
                productName: 'Amoxicillin' as unknown as object,
                productStrength: '500mg' as unknown as object,
                dispensedAmount: '10' as unknown as object,
                dispensedAmountDisplay: '10 tablets' as unknown as object,
                numberOfPackages: '1' as unknown as object,
              },
            ],
          },
        ],
      },
    ]

    // await this.prescriptionsApiWithAuth(
    //   auth,
    // ).mePrescriptionControllerGetPrescriptionsV1({
    //   locale: this.mapLocale(locale),
    // })

    if (!prescriptions) {
      this.logger.debug('No prescriptions returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return prescriptions
  }

  /* Tilvísanir */
  public async getReferrals(
    auth: Auth,
    locale: string,
  ): Promise<Array<ReferralDto> | null> {
    const referrals: ReferralDto[] = [
      {
        id: '1',
        serviceType: 'Þjálfun (serviceType)', // not used
        serviceName: 'Sjúkraþjálfun',
        createdDate: new Date(),
        validUntilDate: new Date(),
        stateValue: 1, // not used
        stateDisplay: 'Virk tilvísun',
        assignedProviderId: '1', // not used
        reasonForReferral: 'Meiðsli á hné',
        fromContactInfo: {
          name: 'Jón Jónsson',
          profession: 'Heimilislæknir',
          department: 'Heilsugæslan Miðbæ',
        },
        toContactInfo: {
          name: 'Opin tilvísun',
          profession: '',
          department: '',
        },
      },
      {
        id: '2',
        serviceType: 'Ofnæmi (serviceType)', // not used
        serviceName: 'Ofnæmislæknir',
        createdDate: new Date(),
        validUntilDate: new Date(),
        stateValue: 1, // not used
        stateDisplay: 'Óvirk tilvísun',
        assignedProviderId: '1', // not used
        reasonForReferral: 'Ofnæmisviðbrögð í húð',
        fromContactInfo: {
          name: 'Jón Jónsson',
          profession: 'Heimilislæknir',
          department: 'Heilsugæslan Miðbæ',
        },
        toContactInfo: {
          name: 'Sigurður Kjartansson',
          profession: 'Ofnæmislækningar',
          department: 'Domus barnalæknar',
        },
      },
    ]

    // await this.referralsApiWithAuth(auth)
    //   .meReferralControllerGetReferralsV1({ locale: this.mapLocale(locale) })
    //   .catch(handle404)

    if (!referrals) {
      this.logger.debug('No referrals returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return referrals
  }

  /* Biðlistar */
  public async getWaitlists(
    auth: Auth,
    locale: string,
  ): Promise<Array<WaitingListEntryDto> | null> {
    const waitlists: WaitingListEntryDto[] = [
      {
        id: '1',
        name: 'Liðskiptaaðgerð á hné',
        organizationName: 'Landspítalinn',
        statusDisplay: 'Samþykktur á lista',
        statusId: 1,
        lastUpdated: new Date('23.11.2023'),
        waitBeganDate: new Date('08.10.2023'),
      },
      {
        id: '2',
        name: 'Hjúkrunarheimili',
        organizationName: 'Sóltún hjúkrunarheimili',
        statusDisplay: 'Umsókn í vinnslu',
        statusId: 2,
        lastUpdated: new Date('12.09.2024'),
        waitBeganDate: new Date('01.02.2022'),
      },
    ]

    // await this.waitingListsApiWithAuth(auth)
    //   .meWaitingListControllerGetWaitingListEntriesV1({
    //     locale: this.mapLocale(locale),
    //   })
    //   .catch(handle404)

    if (!waitlists) {
      this.logger.debug('No waitlists returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return waitlists
  }
}
