import { Auth } from '@island.is/auth-nest-tools'
import {
  HealthDirectorateOrganDonationService,
  HealthDirectorateVaccinationsService,
  OrganDonorDto,
  VaccinationDto,
  organLocale,
} from '@island.is/clients/health-directorate'
import type { Locale } from '@island.is/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import { Donor, DonorInput, Organ } from './models/organ-donation.model'

import { HealthDirectorateHealthService } from '@island.is/clients/health-directorate'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Prescription, Prescriptions } from './models/prescriptions.model'
import { Referral, Referrals } from './models/referrals.model'
import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { Waitlist, Waitlists } from './models/waitlists.model'
import {
  mapPrescriptionCategory,
  mapPrescriptionRenewalBlockedReason,
  mapPrescriptionRenewalStatus,
  mapVaccinationStatus,
} from './utils/mappers'
import {
  MedicineHistory,
  MedicineHistoryItem,
} from './models/medicineHistory.model'
import { isDefined } from '@island.is/shared/utils'
import { ReferralDetail } from './models/referral.model'
import { WaitlistDetail } from './models/waitlist.model'

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly organDonationApi: HealthDirectorateOrganDonationService,
    private readonly healthApi: HealthDirectorateHealthService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /* Organ Donation */
  async getDonorStatus(auth: Auth, locale: Locale): Promise<Donor | null> {
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data: OrganDonorDto | null =
      await this.organDonationApi.getOrganDonation(auth, lang)
    if (data === null) {
      return null
    }
    const hasExceptionComment: boolean =
      data.exceptionComment !== undefined && data.exceptionComment.length > 0
    const hasExceptions: boolean =
      data.exceptions !== undefined && data.exceptions.length > 0
    const donorStatus: Donor = {
      isDonor: data.isDonor,
      limitations: {
        hasLimitations:
          ((hasExceptionComment || hasExceptions) && data.isDonor) ?? false,
        limitedOrgansList: data.exceptions,
        comment: data.exceptionComment,
      },
      isMinor: data.isMinor ?? false,
      isTemporaryResident: data.isTemporaryResident ?? false,
    }
    return donorStatus
  }

  async getDonationExceptions(
    auth: Auth,
    locale: Locale,
  ): Promise<Array<Organ>> {
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data = await this.organDonationApi.getDonationExceptions(auth, lang)
    const limitations: Array<Organ> =
      data?.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      }) ?? []

    return limitations
  }

  async updateDonorStatus(
    auth: Auth,
    input: DonorInput,
    locale: Locale,
  ): Promise<void> {
    const filteredList =
      input.organLimitations?.filter((item) => item !== 'other') ?? []

    return await this.organDonationApi.updateOrganDonation(
      auth,
      {
        isDonor: input.isDonor,
        exceptions: filteredList,
        exceptionComment: input.comment,
      },
      locale === 'is' ? organLocale.Is : organLocale.En,
    )
  }

  /* Vaccinations */
  async getVaccinations(
    auth: Auth,
    locale: Locale,
  ): Promise<Vaccinations | null> {
    const data = await this.vaccinationApi.getVaccinationDiseaseDetail(
      auth,
      locale === 'is' ? 'is' : 'en',
    )
    if (!data) {
      return null
    }

    const vaccinations: Array<Vaccination> =
      data.map((item) => {
        return {
          id: item.diseaseId,
          name: item.diseaseName,
          description: item.diseaseDescription,
          isFeatured: item.isFeatured,
          status: mapVaccinationStatus(item.vaccinationStatus),
          statusName: item.vaccinationStatusName,
          statusColor: item.vaccinationStatusColor,
          lastVaccinationDate: item.lastVaccinationDate ?? null,
          comments: item.comments,
          vaccinationsInfo: item.vaccinations?.map(
            (vaccination: VaccinationDto) => {
              return {
                id: vaccination.id,
                name: vaccination.vaccineCodeDescriptionShort,
                date: vaccination.vaccinationDate,
                age: vaccination.vaccinationAge,
                url: vaccination.vaccineUrl,
                comment: vaccination.generalComment,
                rejected: vaccination.rejected,
                location: vaccination.vaccinationLocation,
              }
            },
          ),
        }
      }) ?? []

    return { vaccinations }
  }

  /* Waitlists */
  async getWaitlists(auth: Auth, locale: Locale): Promise<Waitlists | null> {
    const data = await this.healthApi.getWaitlists(auth, locale)

    if (!data) {
      return null
    }
    const waitlists: Array<Waitlist> =
      data.map((item) => {
        return {
          id: item.id,
          lastUpdated: item.lastUpdated,
          name: item.name,
          waitBegan: item.waitBeganDate,
          organization: item.organizationName.toString(),
          status: item.statusDisplay?.toString(),
        }
      }) ?? []

    return { waitlists }
  }

  /* Waitlist */
  async getWaitlist(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<WaitlistDetail | null> {
    const data = await this.getWaitlists(auth, locale)

    if (!data) {
      return null
    }

    const waitlist: Waitlist | undefined = data.waitlists.find(
      (item) => item.id === id,
    )

    return { data: waitlist }
  }

  /* Referrals */
  async getReferrals(auth: Auth, locale: Locale): Promise<Referrals | null> {
    const data = await this.healthApi.getReferrals(auth, locale)

    if (!data) {
      return null
    }

    const referrals: Array<Referral> =
      data.map((item) => {
        return {
          id: item.id,
          serviceName: item.serviceName,
          createdDate: item.createdDate,
          validUntilDate: item.validUntilDate,
          stateDisplay: item.stateDisplay,
          reason: item.reasonForReferral,
          fromContactInfo: item.fromContactInfo,
          toContactInfo: item.toContactInfo,
        }
      }) ?? []

    return { referrals }
  }

  /* Referral */
  async getReferral(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<ReferralDetail | null> {
    const data = await this.getReferrals(auth, locale)

    if (!data) {
      return null
    }

    const referral: Referral | undefined = data.referrals.find(
      (item) => item.id === id,
    )

    return { data: referral }
  }

  /* Prescriptions */
  async getPrescriptions(
    auth: Auth,
    locale: Locale,
  ): Promise<Prescriptions | null> {
    const data = await this.healthApi.getPrescriptions(auth, locale)

    if (!data) {
      return null
    }

    const prescriptions: Array<Prescription> =
      data.map((item) => {
        return {
          id: item.productId,
          name: item.productName,
          type: item.productType,
          form: item.productForm,
          url: item.productUrl,
          quantity: item.productQuantity?.toString(),
          prescriberName: item.prescriberName,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          dosageInstructions: item.dosageInstructions,
          indication: item.indication,
          totalPrescribedAmount: item.totalPrescribedAmountDisplay,
          category: item.category
            ? mapPrescriptionCategory(item.category)
            : undefined,
          isRenewable: item.isRenewable,
          renewalBlockedReason: item.renewalBlockedReason
            ? mapPrescriptionRenewalBlockedReason(item.renewalBlockedReason)
            : undefined,
          renewalStatus: item.renewalStatus
            ? mapPrescriptionRenewalStatus(item.renewalStatus)
            : undefined,
          amountRemaining: item.amountRemainingDisplay,
          dispensations: item.dispensations.map((item) => {
            return {
              id: item.id,
              agentName: item.dispensingAgentName,
              date: item.dispensationDate,
              count: item.dispensedItemsCount,
              items: item.dispensedItems.map((item) => {
                return {
                  id: item.productId,
                  name: item.productName,
                  strength: item.productStrength,
                  amount: item.dispensedAmountDisplay,
                  numberOfPackages: item.numberOfPackages?.toString(),
                }
              }),
            }
          }),
        }
      }) ?? []

    return { prescriptions }
  }

  /* Medicine History */
  async getMedicineHistory(
    auth: Auth,
    locale: Locale,
  ): Promise<MedicineHistory | null> {
    const data = await this.healthApi.getGroupedDispensations(auth, locale)
    if (!data) {
      return null
    }

    const medicineHistory: Array<MedicineHistoryItem> =
      data.map((item) => {
        return {
          id: item.productId,
          name: item.productName,
          strength: item.productStrength,
          atcCode: item.productAtcCode,
          indication: item.indication,
          lastDispensationDate: item.lastDispensationDate,
          dispensationCount: item.dispensationCount,
          dispensations: item.dispensations.map((subItem) => {
            const quantity = subItem.productQuantity ?? 0

            return {
              id: subItem.productId,
              name: subItem.productName,
              quantity: [quantity.toString(), subItem.productUnit]
                .filter((x) => isDefined(x))
                .join(' '),
              agentName: subItem.dispensingAgentName,
              unit: subItem.productUnit,
              type: subItem.productType,
              indication: subItem.indication,
              dosageInstructions: subItem.dosageInstructions,
              issueDate: subItem.issueDate,
              prescriberName: subItem.prescriberName,
              expirationDate: subItem.expirationDate,
              isExpired: subItem.isExpired,
              date: subItem.dispensationDate,
            }
          }),
        }
      }) ?? []

    return { medicineHistory }
  }
}
