import jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'

import { Application } from '@island.is/application/core'
import { ChargeResult } from '@island.is/api/domains/payment'

import { BaseTemplateAPIModuleConfig } from '../../types'
import { ApplicationPaymentChargeResponse } from '@island.is/api/schema'

export const createAssignToken = (application: Application, secret: string) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
      state: application.state,
    },
    secret,
    { expiresIn: 24 * 60 * 60 },
  )

  return token
}

export const getConfigValue = (
  configService: ConfigService<BaseTemplateAPIModuleConfig>,
  key: keyof BaseTemplateAPIModuleConfig,
) => {
  const value = configService.get(key)

  if (value === undefined) {
    throw new Error(
      `TemplateAPIModules.sharedService: Missing config value for ${key}`,
    )
  }

  return value
}

export const PAYMENT_QUERY = `
  mutation($input: ApplicationPaymentChargeInput!) {
    applicationPaymentCharge(input: $input) {
      id
      paymentUrl
    }
  }
`
