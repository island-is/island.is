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
import {
  DonationException,
  DonorStatus,
  DonorStatusInput,
} from './models/organ-donation.model'

import { Vaccinations } from './models/vaccinations.model'

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly organDonationApi: HealthDirectorateOrganDonationService,
  ) {}

  /* Organ Donation */
  async getDonorStatus(auth: Auth): Promise<DonorStatus> {
    const data: OrganDonorDto | null =
      await this.organDonationApi.getOrganDonation(auth)

    const donorStatus: DonorStatus = {
      isDonor: data?.isDonor || false,
      registrationDate: data?.registrationDate,
      exceptions: data?.exceptions,
      exceptionComment: data?.exceptionComment,
    }
    return donorStatus
  }

  async getDonationExceptions(
    auth: Auth,
    locale: Locale,
  ): Promise<DonationException> {
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data = await this.organDonationApi.getDonationExceptions(auth, lang)
    const exceptions: DonationException = { values: [] }
    exceptions.values =
      data?.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      }) ?? []

    return exceptions
  }

  async updateDonorStatus(auth: Auth, input: DonorStatusInput): Promise<void> {
    return await this.organDonationApi.updateOrganDonation(auth, {
      exceptionComment: input.exceptionComment ?? '',
      isDonor: input.isDonor,
      exceptions: input.exceptions ?? [],
      registrationDate: new Date(),
    })
  }

  /* Vaccinations */
  async getVaccinations(
    auth: Auth,
    locale: Locale,
  ): Promise<Array<Vaccinations>> {
    const data = await this.vaccinationApi.getVaccinationDiseaseDetail(auth, {
      locale,
    })
    const vaccinations: Array<Vaccinations> =
      data?.map((item) => {
        return {
          diseaseId: item.diseaseId,
          diseaseName: item.diseaseName,
          diseaseDescription: item.diseaseDescription,
          vaccinationStatus: item.vaccinationStatus,
          vaccinationsStatusName: item.vaccinationStatusName,
          lastVaccinationDate: item.lastVaccinationDate,
          vaccinations:
            item.vaccinations?.map((vaccination: VaccinationDto) => {
              return {
                id: vaccination.id,
                nationalId: vaccination.nationalId,
                code: vaccination.code,
                vaccinationDate: vaccination.vaccinationDate,
                vaccinationsAge: vaccination.vaccinationAge,
                generalComment: vaccination.generalComment,
                rejected: vaccination.rejected,
              }
            }) ?? [],
        }
      }) ?? []
    return vaccinations
  }
}
