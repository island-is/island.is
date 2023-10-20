import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { info } from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { CriminalRecord } from '@island.is/clients/criminal-record'
import { dummyPdf, karmellukast } from './pdfs'

@Injectable()
export class CriminalRecordProviderService extends BaseTemplateApiService {
  constructor(
    private readonly criminalRecordService: CriminalRecordService, // private readonly syslumennService: SyslumennService,
  ) {
    super('CriminalRecordShared')
  }

  async validateCriminalRecord({ auth }: TemplateApiModuleActionProps) {
    // Validate applicants age
    const minAge = 15
    const { age } = info(auth.nationalId)
    if (age < minAge) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
          summary: coreErrorMessages.couldNotAssignApplicationErrorDescription,
        },
        400,
      )
    }

    return await this.criminalRecordService.validateCriminalRecord(
      auth.nationalId,
    )
  }

  async getCriminalRecordPDF(): Promise<CriminalRecord> {
    try {
      const sealedDocument: CriminalRecord = {
        contentBase64: dummyPdf,
      }

      return sealedDocument
    } catch (error) {
      console.log(error)
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að sækja sakavottorð',
          summary: 'Þetta er vesen',
        },
        400,
      )
    }
  }

  async getCaramelPDF(): Promise<CriminalRecord> {
    try {
      const sealedDocument: CriminalRecord = {
        contentBase64: karmellukast,
      }

      return sealedDocument
    } catch (error) {
      console.log(error)
      throw new TemplateApiError(
        {
          title: 'Ekki tókst að sækja sakavottorð',
          summary: 'Þetta er vesen',
        },
        400,
      )
    }
  }
}
