import jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'

import { Application } from '@island.is/application/core'

import { BaseTemplateAPIModuleConfig } from '../../types'

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
