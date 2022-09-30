import {
  InternalServerErrorException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'
import { format } from 'date-fns' // eslint-disable-line no-restricted-imports

import {
  GetSjukratryggdurTypeDto,
  GetFaUmsoknSjukratryggingTypeDto,
  GetVistaSkjalDtoType,
  GetVistaSkjalBody,
  Fylgiskjal,
  Fylgiskjol,
} from './dto'
import { BucketService } from '../bucket.service'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'

export const HEALTH_INSURANCE_CONFIG = 'HEALTH_INSURANCE_CONFIG'

export interface HealthInsuranceConfig {
  wsdlUrl: string
  baseUrl: string
  username: string
  password: string
  clientID: string
  xroadID: string
}

@Injectable()
export class HealthInsuranceRESTAPI {
  constructor(
    private readonly restApi: DocumentApi,
    @Inject(BucketService)
    private bucketService: BucketService,
  ) {}

  // check whether the person is health insured
  public async isHealthInsured(
    nationalId: string,
    date = Date.now(),
  ): Promise<boolean> {
    logger.info(`--- Starting isHealthInsured api call ---`)

    const args = {
      sendandi: '',
      kennitala: nationalId,
      dagsetning: date,
    }

    return true
  }
}
