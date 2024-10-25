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

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly organDonationApi: HealthDirectorateOrganDonationService,
  ) {}

  /* Organ Donation */
  async getDonorStatus(auth: Auth, locale: Locale): Promise<Donor | null> {
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data: OrganDonorDto | null =
      await this.organDonationApi.getOrganDonation(auth, lang)
    if (data === null) {
      return null
    }
    const donorStatus: Donor = {
      isDonor: data?.isDonor ?? true,
      limitations: {
        hasLimitations:
          ((data?.exceptions?.length ?? 0) > 0 && data?.isDonor) ?? false,
        limitedOrgansList: data?.exceptions,
        comment: data?.exceptionComment,
      },
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
    return await this.organDonationApi.updateOrganDonation(
      auth,
      {
        isDonor: input.isDonor,
        exceptions: input.organLimitations ?? [],
      },
      locale === 'is' ? organLocale.Is : organLocale.En,
    )
  }

  /* Vaccinations */
  async getVaccinations(auth: Auth): Promise<Vaccinations | null> {
    const data = await this.vaccinationApi.getVaccinationDiseaseDetail(auth)
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
}
