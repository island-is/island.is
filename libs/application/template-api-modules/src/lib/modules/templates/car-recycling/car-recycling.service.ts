import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import {
  RecyclingFundClientService,
  //RecyclingRequestTypes,
} from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { applicationCheck } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { getApplicationAnswers } from '@island.is/application/templates/car-recycling'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private recyclingFundService: RecyclingFundClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async getVehicles({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      console.log('getVehicles')

      const response = await this.recyclingFundService.createRecyclingRequest(
        auth,
      )

      /* if (!response) {
        throw new Error(`Failed to get vehicles from: ${response}`)
      }
      return response*/
    } catch (e) {
      this.logger.error('Failed to vehicles', e)
      throw this.parseErrors(e)
    }
  }

  async createOwner({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const response = await this.recyclingFundService.createOwner(auth)

      /* if (!response) {
        throw new Error(`Failed to create owner: ${response}`)
      }
      return response*/
    } catch (e) {
      this.logger.error('Failed to create owner', e)
      throw this.parseErrors(e)
    }
  }

  async sendApplication({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
        application.answers,
      )

      selectedVehicles.forEach(async (vehicle) => {
        if (vehicle && vehicle.permno) {
          /* const response = await this.recyclingFundService.createVehicle(
            auth,
            vehicle.permno,
          )

          if (!response) {
            throw new Error(
              `Failed to create vechicle: ${vehicle} - ${response}`,
            )
          }
*/
          /* const response1 = await this.recyclingFundService.recycleVehicle(
            auth,
            vehicle.permno,
            RecyclingRequestTypes.pendingRecycle,
          )

          if (!response1) {
            throw new Error(
              `Failed to recycle vehicle:  ${vehicle} -  ${response1}`,
            )
          }*/
        }
      })

      /*canceledVehicles.forEach(async (vehicle) => {

      })*/

      return true
    } catch (e) {
      this.logger.error('Failed to create owner', e)
      throw this.parseErrors(e)
    }
  }
}
