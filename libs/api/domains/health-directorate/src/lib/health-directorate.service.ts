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
import { Prescription, Prescriptions } from './models/prescriptions'
import { Referral, Referrals } from './models/referrals.model'
import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { Waitlist, Waitlists } from './models/waitlists.model'
import {
  mapPrescriptionCategory,
  mapPrescriptionRenewalBlockedReason,
  mapPrescriptionRenewalStatus,
  mapVaccinationStatus,
} from './utils/mappers'

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
          lastUpdated: item.lastUpdated
            ? new Date(item.lastUpdated?.toString())
            : undefined,
          name: item.name,
          waitBegan: item.waitBeganDate
            ? new Date(item.waitBeganDate?.toString())
            : undefined,
          organization: item.organizationName.toString(),
          status: item.statusDisplay?.toString(),
        }
      }) ?? []

    return { waitlists }
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
          createdDate: item.createdDate
            ? new Date(item.createdDate?.toString())
            : undefined,
          validUntilDate: item.validUntilDate
            ? new Date(item.validUntilDate?.toString())
            : undefined,
          stateDisplay: item.stateDisplay,
          reason: item.reasonForReferral,
          fromContactInfo: item.fromContactInfo,
          toContactInfo: item.toContactInfo,
        }
      }) ?? []

    return { referrals }
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
          prescribedItemId: item.prescribedItemId,
          prescriptionId: item.prescriptionId,
          prescriberId: item.prescriberId,
          prescriberName: item.prescriberName,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          productId: item.productId,
          productName: item.productName,
          productType: item.productType,
          productForm: item.productForm,
          productUrl: item.productUrl,
          productStrength: item.productStrength,
          productQuantity: item.productQuantity,
          category: item.category
            ? mapPrescriptionCategory(item.category)
            : undefined,
          dosageInstructions: item.dosageInstructions,
          indication: item.indication,
          totalPrescribedAmount: item.totalPrescribedAmount,
          totalPrescribedAmountDisplay: item.totalPrescribedAmountDisplay,
          isRegiment: item.isRegiment ? true : false,
          isRenewable: item.isRenewable,
          renewalBlockedReason: item.renewalBlockedReason
            ? mapPrescriptionRenewalBlockedReason(item.renewalBlockedReason)
            : undefined,
          renewalStatus: item.renewalStatus
            ? mapPrescriptionRenewalStatus(item.renewalStatus)
            : undefined,
          amountRemaining: item.amountRemaining,
          amountRemainingUnit: item.amountRemainingUnit,
          amountRemainingDisplay: item.amountRemainingDisplay,
          percentageRemaining: item.percentageRemaining,
          isFullyDispensed: item.isFullyDispensed,
          dispensations: item.dispensations.map((item) => {
            return {
              id: item.id,
              dispensingAgentId: item.dispensingAgentId,
              dispensingAgentName: item.dispensingAgentName,
              dispensationDate: item.dispensationDate,
              dispensedItemsCount: item.dispensedItemsCount,
              dispensedItems: item.dispensedItems.map((item) => {
                return {
                  productId: item.productId,
                  productName: item.productName,
                  productStrength: item.productStrength,
                  dispensedAmount: item.dispensedAmount,
                  dispensedAmountDisplay: item.dispensedAmountDisplay,
                  numberOfPackages: item.numberOfPackages,
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
  ): Promise<Prescriptions | null> {
    return null
  }
}
