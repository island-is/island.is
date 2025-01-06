import { Injectable } from '@nestjs/common'
import {
  HealthDirectorateVaccinationsService,
  HealthDirectorateOrganDonationService,
  OrganDonorDto,
  VaccinationDto,
  organLocale,
} from '@island.is/clients/health-directorate'
import { Auth } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { Donor, DonorInput, Organ } from './models/organ-donation.model'

import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { mapVaccinationStatus } from './utils/mappers'
import { Logger } from '@island.is/logging'
import { HealthDirectorateHealthService } from '@island.is/clients/health-directorate'
import { Waitlists } from './models/waitlists.model'
import { Referrals } from './models/referrals.model'

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly organDonationApi: HealthDirectorateOrganDonationService,
    private readonly healthApi: HealthDirectorateHealthService,
    private readonly logger: Logger,
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
    if (data === null) {
      return null
    }

    const vaccinations: Array<Vaccination> =
      data?.map((item) => {
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
    const waitlists: Waitlists = {
      waitlists: [],
    }

    waitlists.waitlists = data.map((item) => {
      return {
        id: item.id,
        lastUpdated: item.lastUpdated
          ? new Date(item.lastUpdated?.toString())
          : undefined,
        name: item.name,
        waitBeganDate: item.waitBeganDate
          ? new Date(item.waitBeganDate?.toString())
          : undefined,
        statusDisplay: item.statusDisplay?.toString(),
      }
    })

    return waitlists
  }

  /* Referrals */
  async getReferrals(auth: Auth, locale: Locale): Promise<Referrals | null> {
    const data = await this.healthApi.getReferrals(auth, locale)

    if (!data) {
      return null
    }

    const referrals: Referrals = {
      Referrals: data.map((item) => {
        return {
          id: item.id,
          serviceType: item.serviceType,
          serviceName: item.serviceName,
          createdDate: item.createdDate
            ? new Date(item.createdDate?.toString())
            : undefined,
          validUntilDate: item.validUntilDate
            ? new Date(item.validUntilDate?.toString())
            : undefined,
          stateValue: item.stateValue,
          stateDisplay: item.stateDisplay,
          assignedProviderId: item.assignedProviderId,
          reason: item.reasonForReferral,
          fromContactInfo: item.fromContactInfo,
          toContactInfo: item.toContactInfo,
        }
      }),
    }

    return referrals
  }
}
