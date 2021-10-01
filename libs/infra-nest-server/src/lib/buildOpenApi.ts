import { writeFileSync } from 'fs'
import { NestFactory } from '@nestjs/core'
import { logger, LoggingModule } from '@island.is/logging'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { Type } from '@nestjs/common'
import yaml from 'js-yaml'

import { InfraModule } from './infra/infra.module'

export const buildOpenApi = async ({
  appModule,
  openApi,
  path,
}: {
  appModule: Type<any>
  openApi: Omit<OpenAPIObject, 'paths'>
  path: string
}) => {
  try {
    logger.info('Creating openapi.yaml file ...', { path })

    const app = await NestFactory.create(InfraModule.forRoot(appModule), {
      logger: LoggingModule.createLogger(),
    })
    const document = SwaggerModule.createDocument(app, openApi)

    return writeFileSync(path, yaml.dump(document, { noRefs: true }))
  } catch (e) {
    logger.error('Error while creating openapi.yaml', { message: e.message })
  }
}
