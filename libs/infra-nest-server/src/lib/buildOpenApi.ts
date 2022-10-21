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
  enableVersioning = false,
}: {
  appModule: Type<any>
  openApi: Omit<OpenAPIObject, 'paths'>
  path: string
  enableVersioning: boolean
}) => {
  try {
    logger.info('Creating openapi.yaml file ...', { path })

    const app = await NestFactory.create(InfraModule.forRoot({ appModule }), {
      logger: LoggingModule.createLogger(),
    })
    if (enableVersioning) {
      app.enableVersioning()
    }
    const document = SwaggerModule.createDocument(app, openApi)

    writeFileSync(path, yaml.dump(document, { noRefs: true }))

    // Shut down everything so the process ends.
    await app.close()

    // Unfortunately, the above is not enough sometimes because of this bug:
    // https://github.com/configcat/common-js/issues/36
    // TODO: Remove this when it's been fixed.
    process.exit(0)
  } catch (e: any) {
    logger.error('Error while creating openapi.yaml', { message: e.message })
  }
}
