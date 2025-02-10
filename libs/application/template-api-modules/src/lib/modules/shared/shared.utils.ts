import jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'

import { Application } from '@island.is/application/types'

import { SharedModuleConfig } from '../../types'

export const createAssignToken = (
  application: Application,
  secret: string,
  expiresIn: number,
  nonce: string,
) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
      state: application.state,
      nonce,
    },
    secret,
    { expiresIn },
  )

  return token
}

export const getConfigValue = (
  configService: ConfigService,
  key: keyof SharedModuleConfig,
) => {
  const value = configService.get(`SharedModuleConfig.${key}`)

  if (value === undefined) {
    throw new Error(
      `TemplateAPIModules.sharedService: Missing config value for ${key}`,
    )
  }

  return value
}

export const objectToXML = (obj: object) => {
  let xml = ''
  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry
    if (value === undefined) {
      return
    }
    xml += value instanceof Array ? '' : '<' + key + '>'
    if (value instanceof Array) {
      for (const i in value) {
        xml += '<' + key + '>'
        xml += objectToXML(value[i])
        xml += '</' + key + '>'
      }
    } else if (typeof value == 'object') {
      xml += objectToXML(new Object(value))
    } else {
      xml += value
    }
    xml += value instanceof Array ? '' : '</' + key + '>'
  })
  return xml
}
