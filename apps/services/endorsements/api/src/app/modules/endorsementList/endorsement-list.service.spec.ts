// import { Test, TestingModule } from '@nestjs/testing'
// import { EndorsementListService } from './endorsementList.service'
// import { getModelToken } from '@nestjs/sequelize'
// import { EndorsementList } from './endorsementList.model'
// import { Endorsement } from '../endorsement/models/endorsement.model'
// import { LOGGER_PROVIDER } from '@island.is/logging'
// import { EmailService } from '@island.is/email-service'
// import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
// import { AwsService } from '@island.is/nest/aws'

// describe('EndorsementListService', () => {
//   let service: EndorsementListService

//   const mockEndorsementModel = {}
//   const mockEndorsementListModel = {
//     findOne: jest.fn(),
//     create: jest.fn(),
//   }
//   const mockLogger = { info: jest.fn(), warn: jest.fn() }
//   const mockEmailService = {}
//   const mockNationalRegistryApiV3 = {}
//   const mockAwsService = {}

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         EndorsementListService,
//         {
//           provide: getModelToken(Endorsement),
//           useValue: mockEndorsementModel,
//         },
//         {
//           provide: getModelToken(EndorsementList),
//           useValue: mockEndorsementListModel,
//         },
//         {
//           provide: LOGGER_PROVIDER,
//           useValue: mockLogger,
//         },
//         {
//           provide: EmailService,
//           useValue: mockEmailService,
//         },
//         {
//           provide: NationalRegistryV3ClientService,
//           useValue: mockNationalRegistryApiV3,
//         },
//         {
//           provide: AwsService,
//           useValue: mockAwsService,
//         },
//       ],
//     }).compile()

//     service = module.get<EndorsementListService>(EndorsementListService)
//   })

//   it('should be defined', () => {
//     expect(service).toBeDefined()
//   })

//   describe('getListOwnerNationalId', () => {
//     it('should return the owner national ID when the list exists', async () => {
//       const mockList = { owner: '1234567890' }
//       mockEndorsementListModel.findOne.mockResolvedValue(mockList)

//       const result = await service.getListOwnerNationalId('list-id')
//       expect(result).toBe('1234567890')
//     })

//     it('should return null when the list does not exist', async () => {
//       mockEndorsementListModel.findOne.mockResolvedValue(null)

//       const result = await service.getListOwnerNationalId('non-existent-id')
//       expect(result).toBeNull()
//     // expect(true).toBe(true)
//     })
//   })

// //   describe('create', () => {
// //     it('should create a new endorsement list', async () => {
// //       const mockInput = {
// //         title: 'Test List',
// //         description: 'Test Description',
// //         owner: '1234567890',
// //         openedDate: new Date('2023-01-01'),
// //         closedDate: new Date('2023-12-31'),
// //       }
// //       const mockCreatedList = { ...mockInput, id: 'new-list-id' }
// //       mockEndorsementListModel.create.mockResolvedValue(mockCreatedList)

// //       const result = await service.create(mockInput)
// //       expect(result).toEqual(mockCreatedList)
// //       expect(mockEndorsementListModel.create).toHaveBeenCalledWith(mockInput)
// //     })

// //     // Add more tests for error cases (e.g., missing dates, invalid date range)
// //   })

//   // Add more describe blocks for other methods as needed
// })

import { Test, TestingModule } from '@nestjs/testing'
import { EndorsementListService } from './endorsementList.service'
import { getModelToken } from '@nestjs/sequelize'
import { Logger } from '@island.is/logging'
import { EmailService } from '@island.is/email-service'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { AwsService } from '@island.is/nest/aws'
import { EndorsementList } from './endorsementList.model'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'

describe('EndorsementListService', () => {
  let service: EndorsementListService
  let endorsementListModel: typeof EndorsementList
  let endorsementModel: typeof Endorsement

  const createInput = {
    title: 'Test List',
    openedDate: new Date('2024-01-01'),
    closedDate: new Date('2023-01-01'),
    owner: '1234567890',
    description: 'Test description',
    endorsementMetadata: {},
    tags: [],
    meta: {},
    adminLock: false,
  }

  const mockEndorsementListModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }

  const mockEndorsementModel = {
    count: jest.fn(),
  }

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  const mockEmailService = {
    sendEmail: jest.fn(),
  }

  const mockNationalRegistryService = {
    getName: jest.fn(),
  }

  const mockAwsService = {
    uploadFile: jest.fn(),
    getPresignedUrl: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EndorsementListService,
        {
          provide: getModelToken(EndorsementList),
          useValue: mockEndorsementListModel,
        },
        {
          provide: getModelToken(Endorsement),
          useValue: mockEndorsementModel,
        },
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
        { provide: EmailService, useValue: mockEmailService },
        {
          provide: NationalRegistryV3ClientService,
          useValue: mockNationalRegistryService,
        },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile()

    service = module.get<EndorsementListService>(EndorsementListService)
    endorsementListModel = module.get<typeof EndorsementList>(
      getModelToken(EndorsementList),
    )
    endorsementModel = module.get<typeof Endorsement>(
      getModelToken(Endorsement),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getListOwnerNationalId', () => {
    it('should return the owner of the endorsement list', async () => {
      const mockList = { owner: '1234567890' }
      mockEndorsementListModel.findOne.mockResolvedValue(mockList)

      const result = await service.getListOwnerNationalId('some-list-id')
      expect(result).toBe(mockList.owner)
      expect(endorsementListModel.findOne).toHaveBeenCalledWith({
        where: { id: 'some-list-id' },
      })
    })

    it('should return null if the list is not found', async () => {
      mockEndorsementListModel.findOne.mockResolvedValue(null)

      const result = await service.getListOwnerNationalId('non-existent-id')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    // it('should throw BadRequestException for invalid date range', async () => {
    //   await expect(service.create(createInput)).rejects.toThrow(
    //     BadRequestException,
    //   )
    // })
    // it('should create a new endorsement list', async () => {
    //   const createInput = {
    //     title: 'Test List',
    //     openedDate: new Date('2024-01-01'),
    //     closedDate: new Date('2024-12-01'),
    //     owner: '1234567890',
    //   }
    //   const mockList = { id: 'some-list-id' }
    //   mockEndorsementListModel.create.mockResolvedValue(mockList)
    //   const result = await service.create(createInput)
    //   expect(result).toBe(mockList)
    //   expect(endorsementListModel.create).toHaveBeenCalledWith(createInput)
    // })
  })

  describe('findSingleList', () => {
    it('should return the list if found', async () => {
      const mockList = { id: 'some-list-id', adminLock: false }
      mockEndorsementListModel.findOne.mockResolvedValue(mockList)

      const result = await service.findSingleList('some-list-id')

      expect(result).toBe(mockList)
    })

    it('should throw NotFoundException if list is not found', async () => {
      mockEndorsementListModel.findOne.mockResolvedValue(null)

      await expect(service.findSingleList('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
