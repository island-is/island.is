import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { HmsRentalAgreementService } from '@island.is/clients/hms-rental-agreement'
import {
  applicationAnswers,
  draftAnswers,
} from '@island.is/application/templates/hms/rental-agreement'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { mapRentalApplicationData } from './utils/mapRentalApplicationData'
import { mapDraftToContractRequest } from './utils/mapDraftToContractRequest'
import {
  fetchFinancialIndexationForMonths,
  listOfLastMonths,
  FinancialIndexationEntry,
  errorMapper,
} from './utils/utils'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(private readonly hmsService: HmsRentalAgreementService) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  async consumerIndex(): Promise<FinancialIndexationEntry[]> {
    const numberOfMonths = 36 // Number of months to fetch
    const months = listOfLastMonths(numberOfMonths)

    return await fetchFinancialIndexationForMonths(months)
  }

  async sendDraft({ application, auth }: TemplateApiModuleActionProps) {
    const { id, answers } = application

    const draft = draftAnswers(applicationAnswers(answers), id)
    const contractDraftRequest = mapDraftToContractRequest(draft)

    return await this.hmsService.postDraftContract(auth, contractDraftRequest)
  }

  async submitApplicationToHmsRentalService({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application

    const mappedAnswers = applicationAnswers(answers)

    const leaseApplication = mapRentalApplicationData(
      id,
      applicant,
      mappedAnswers,
    )

    return await this.hmsService
      .postContract(auth, { leaseApplication })
      .catch((error) => {
        const errorMessage = `Error sending application ${id} to HMS Rental Service`
        console.error(errorMessage, error)

        const mappedError = errorMapper(error)

        throw mappedError
      })
  }
}
