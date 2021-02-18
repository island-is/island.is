import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { transformApplicationToHealthInsuranceDTO } from './health-insurance.utils'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}
  // async sendApplication({ application }: TemplateApiModuleActionProps){
  //   console.log("---------- Application --------------")
  //   console.log(JSON.stringify(application, null, 2))
  //   const vistaSkjal = transformApplicationToHealthInsuranceDTO(application)
  //   console.log("-------------- Vistaskjal inputs --------------")
  //   console.log(JSON.stringify(vistaSkjal, null, 2))
  //   await new Promise((resolve) => setTimeout(resolve, 2000))
  //   // await this.healthInsuranceServiceBackend.applyInsurance(vistaSkjal)

  //   console.log("Health-Insurance - Finished sendApplication")
  // }

  async sendApplication({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    try {
      const vistaSkjal = transformApplicationToHealthInsuranceDTO(application)
      const query = transformApplicationToHealthInsuranceDTO(application)
      console.log(query)
      const res = await this.sharedTemplateAPIService.makeGraphqlQuery(authorization, query).then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.log("erroring")
          return response.errors
        }
        console.log("returnning")
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        console.log("Catching")
        return error
      })
      console.log(JSON.stringify(res, null, 2))
      console.log("Health-Insurance - Finished sendApplication")
    } catch (error) {
      logger.error(`Health insurance application failed because: ${error}`)
      throw error
    }
  }
}
