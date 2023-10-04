import { mock } from 'jest-mock-extended'
import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { AwsS3Service } from '../../aws-s3'
import { CaseService } from '../../case'
import { CourtService } from '../../court'
import { FileController } from '../file.controller'
import { FileService } from '../file.service'
import { InternalFileController } from '../internalFile.controller'
import { LimitedAccessFileController } from '../limitedAccessFile.controller'
import { CaseFile } from '../models/file.model'

jest.mock('../../aws-s3/awsS3.service.ts')
jest.mock('../../court/court.service.ts')
jest.mock('../../case/case.service.ts')

export const createTestingFileModule = async () => {
  const fileModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [
      FileController,
      InternalFileController,
      LimitedAccessFileController,
    ],
    providers: [
      CaseService,
      CourtService,
      AwsS3Service,
      {
        provide: IntlService,
        useValue: {
          useIntl: async () => ({
            formatMessage: createTestIntl({
              onError: jest.fn(),
              locale: 'is-IS',
            }).formatMessage,
          }),
        },
      },
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(CaseFile),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      FileService,
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)

  const courtService = fileModule.get<CourtService>(CourtService)

  const fileModel = await fileModule.resolve<typeof CaseFile>(
    getModelToken(CaseFile),
  )

  const fileService = fileModule.get<FileService>(FileService)

  const fileController = fileModule.get<FileController>(FileController)

  const internalFileController = fileModule.get<InternalFileController>(
    InternalFileController,
  )

  const limitedAccessFileController =
    fileModule.get<LimitedAccessFileController>(LimitedAccessFileController)

  const sequelize = fileModule.get<Sequelize>(Sequelize)

  fileModule.close()

  return {
    sequelize,
    awsS3Service,
    courtService,
    fileModel,
    fileService,
    fileController,
    internalFileController,
    limitedAccessFileController,
  }
}
