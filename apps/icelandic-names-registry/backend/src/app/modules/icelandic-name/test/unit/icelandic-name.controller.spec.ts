import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { NameType, StatusType } from '@island.is/icelandic-names-registry-types'
import { LoggingModule } from '@island.is/logging'

import { IcelandicNameController } from '../../icelandic-name.controller'
import { IcelandicNameService } from '../../icelandic-name.service'
import { IcelandicName } from '../../icelandic-name.model'
import { CreateIcelandicNameBodyDto } from '../../dto'

describe('IcelandicNameController', () => {
  let icelandicNameController: IcelandicNameController
  let icelandicNameService: IcelandicNameService

  const icelandicName = {
    id: 1,
    icelandicName: 'Laqueesha',
    type: 'ST',
    status: 'Haf',
    visible: true,
    verdict: 'verdict',
    url: 'url',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  }

  const icelandicNameDto: CreateIcelandicNameBodyDto = {
    icelandicName: 'Laqueesha',
    type: 'ST' as NameType,
    status: 'Haf' as StatusType,
    visible: true,
    verdict: 'verdict',
    url: 'url',
  }

  const user: User = {
    authorization: '',
    client: '',
    nationalId: '1234567890',
    scope: [],
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        LoggingModule,
        AuditModule.forRoot({
          defaultNamespace: '@island.is/icelandic-names-registry',
        }),
      ],
      providers: [
        IcelandicNameController,
        {
          provide: IcelandicNameService,
          useClass: jest.fn(() => ({
            getAll: () => ({}),
            getByInitialLetter: () => ({}),
            getById: () => ({}),
            updateNameById: () => ({}),
            createName: () => ({}),
            deleteById: () => ({}),
          })),
        },
        {
          provide: getModelToken(IcelandicName),
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile()

    icelandicNameController = moduleRef.get<IcelandicNameController>(
      IcelandicNameController,
    )
    icelandicNameService =
      moduleRef.get<IcelandicNameService>(IcelandicNameService)
  })

  it('should create an icelandic name', async () => {
    jest
      .spyOn(icelandicNameService as any, 'createName')
      .mockImplementation(() => Promise.resolve(icelandicName))

    const result = await icelandicNameController.createName(
      icelandicNameDto,
      user,
    )

    expect(result).toEqual(icelandicName)
  })

  it('should get all icelandic names', async () => {
    jest
      .spyOn(icelandicNameService as any, 'getAll')
      .mockImplementation(() => Promise.resolve([icelandicName]))

    const result = await icelandicNameController.getAll()

    expect(result).toEqual([icelandicName])
  })

  it('should get icelandic names by id', async () => {
    jest
      .spyOn(icelandicNameService as any, 'getById')
      .mockImplementation(() => Promise.resolve(icelandicName))

    const result = await icelandicNameController.getById(1)

    expect(result).toEqual(icelandicName)
  })
})
