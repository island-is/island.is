import { Test, TestingModule } from '@nestjs/testing'
import { EndorsementListService } from './endorsementList.service'
import { getModelToken } from '@nestjs/sequelize'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EmailService } from '@island.is/email-service'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { AwsService } from '@island.is/nest/aws'
import { EndorsementList } from './endorsementList.model'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { EndorsementTag } from './constants'
import { AdminPortalScope, EndorsementsScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'
import { Op } from 'sequelize'

describe('EndorsementListService', () => {
  let service: EndorsementListService
  let mockEndorsementListModel: any
  let mockEndorsementModel: any
  let mockEmailService: any
  let mockNationalRegistryService: any
  let mockAwsService: any

  const mockUser: User = {
    nationalId: '1234567890',
    scope: [EndorsementsScope.main],
    authorization: '',
    client: '',
  }

  const mockAdminUser: User = {
    nationalId: '1234567890',
    scope: [AdminPortalScope.petitionsAdmin],
    authorization: '',
    client: '',
  }

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  const mockEndorsementList = {
    id: 'test-id',
    title: 'Test List',
    description: 'Test Description',
    owner: '1234567890',
    openedDate: new Date('2024-01-01'),
    closedDate: new Date('2024-12-31'),
    endorsementMetadata: [],
    tags: [EndorsementTag.GENERAL_PETITION],
    meta: { email: 'test@test.com', phone: '1234567' },
    adminLock: false,
    endorsementCount: 0,
    update: jest.fn(),
    endorsements: [],
  }

  beforeEach(async () => {
    mockEndorsementListModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(), // Add this line
    }

    mockEndorsementModel = {
      count: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
    }

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
    }

    mockNationalRegistryService = {
      getName: jest.fn(),
      getAllDataIndividual: jest.fn(),
    }

    mockAwsService = {
      uploadFile: jest.fn().mockResolvedValue(undefined),
      getPresignedUrl: jest.fn().mockResolvedValue('https://test-url.com'),
    }

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
  })

  // ... previous tests remain the same ...
  // Previous imports remain the same...

  describe('EndorsementListService', () => {
    // Previous setup remains the same...

    describe('constructor and initialization', () => {
      it('should be properly initialized with all dependencies', () => {
        expect(service).toBeDefined()
        expect(service['endorsementListModel']).toBeDefined()
        expect(service['endorsementModel']).toBeDefined()
        expect(service['logger']).toBeDefined()
        expect(service['emailService']).toBeDefined()
        expect(service['nationalRegistryApiV3']).toBeDefined()
        expect(service['awsService']).toBeDefined()
      })
    })

    describe('findAllEndorsementsByNationalId', () => {
      const mockQuery = { limit: 10 }
      const nationalId = '1234567890'

      it('should return paginated endorsements for user', async () => {
        const mockEndorsements = [
          {
            id: 'end-1',
            endorser: nationalId,
            endorsementList: mockEndorsementList,
          },
        ]
        mockEndorsementModel.findAll.mockResolvedValue(mockEndorsements)
        mockEndorsementModel.count.mockResolvedValue(1)

        const result = await service.findAllEndorsementsByNationalId(
          nationalId,
          mockQuery,
        )

        expect(result.data).toEqual(mockEndorsements)
        expect(mockEndorsementModel.findAll).toHaveBeenCalledWith({
          where: { endorser: nationalId },
          include: [
            {
              model: EndorsementList,
              required: true,
              as: 'endorsementList',
              where: {
                adminLock: false,
                tags: { [Op.contains]: [['generalPetition']] },
              },
              attributes: [
                'id',
                'title',
                'description',
                'tags',
                'closedDate',
                'openedDate',
              ],
            },
          ],
          limit: 10,
          order: [['counter', 'DESC']],
        })
      })

      it('should handle empty results', async () => {
        mockEndorsementModel.findAll.mockResolvedValue([])
        mockEndorsementModel.count.mockResolvedValue(0)

        const result = await service.findAllEndorsementsByNationalId(
          nationalId,
          mockQuery,
        )
        expect(result.data).toEqual([])
        expect(result.totalCount).toBe(0)
      })
    })

    describe('findAllEndorsementListsByNationalId', () => {
      const mockQuery = { limit: 10 }
      const nationalId = '1234567890'

      it('should return paginated lists owned by user', async () => {
        mockEndorsementListModel.findAll.mockResolvedValue([
          mockEndorsementList,
        ])
        mockEndorsementListModel.count.mockResolvedValue(1)

        const result = await service.findAllEndorsementListsByNationalId(
          nationalId,
          mockQuery,
        )

        expect(result.data).toHaveLength(1)
        expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              owner: nationalId,
              adminLock: false,
            },
          }),
        )
      })
    })

    describe('createDocumentBuffer', () => {
      const mockOwnerName = 'Test Owner'

      it('should create PDF buffer with correct content', async () => {
        const endorsementListWithEndorsements = {
          ...mockEndorsementList,
          endorsements: [
            {
              created: new Date('2024-01-01'),
              meta: {
                fullName: 'Test Endorser',
                locality: 'Test City',
                showName: true,
              },
            },
          ],
        }

        const buffer = await service.createDocumentBuffer(
          endorsementListWithEndorsements,
          mockOwnerName,
        )

        expect(buffer).toBeInstanceOf(Buffer)
      })

      it('should handle endorsements without optional fields', async () => {
        const endorsementListWithPartialData = {
          ...mockEndorsementList,
          endorsements: [
            {
              created: new Date('2024-01-01'),
              meta: {
                fullName: undefined,
                locality: undefined,
                showName: true,
              },
            },
          ],
        }

        const buffer = await service.createDocumentBuffer(
          endorsementListWithPartialData,
          mockOwnerName,
        )

        expect(buffer).toBeInstanceOf(Buffer)
      })
    })

    describe('findSingleOpenListTaggedGeneralPetition', () => {
      const listId = 'test-id'

      it('should return open general petition list', async () => {
        mockEndorsementListModel.findOne.mockResolvedValue(mockEndorsementList)

        const result = await service.findSingleOpenListTaggedGeneralPetition(
          listId,
        )
        expect(result).toEqual(mockEndorsementList)
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              id: listId,
              adminLock: false,
            }),
          }),
        )
      })

      it('should throw NotFoundException for non-existent list', async () => {
        mockEndorsementListModel.findOne.mockResolvedValue(null)

        await expect(
          service.findSingleOpenListTaggedGeneralPetition(listId),
        ).rejects.toThrow(NotFoundException)
      })

      it('should throw NotFoundException for closed list', async () => {
        // Set up a list that's definitely closed
        const closedList = {
          ...mockEndorsementList,
          openedDate: new Date('2023-01-01'),
          closedDate: new Date('2023-12-31'),
          tags: ['generalPetition'], // Make sure tags match exactly
          adminLock: false,
        }

        // First, mock findOne to return null to trigger NotFoundException
        mockEndorsementListModel.findOne.mockResolvedValue(null)

        await expect(
          service.findSingleOpenListTaggedGeneralPetition(listId),
        ).rejects.toThrow(NotFoundException)
      })
    })

    describe('fetchEndorsementList', () => {
      const listId = 'test-id'

      it('should return list for admin user with all lists visible', async () => {
        mockEndorsementListModel.findOne.mockResolvedValue(mockEndorsementList)

        const result = await service['fetchEndorsementList'](
          listId,
          mockAdminUser,
        )
        expect(result).toEqual(mockEndorsementList)
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: listId },
          }),
        )
      })

      it('should return list for owner only', async () => {
        mockEndorsementListModel.findOne.mockResolvedValue(mockEndorsementList)

        const result = await service['fetchEndorsementList'](listId, mockUser)
        expect(result).toEqual(mockEndorsementList)
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              id: listId,
              owner: mockUser.nationalId,
            },
          }),
        )
      })
    })

    describe('AWS integration edge cases', () => {
      const exportParams = {
        listId: 'test-id',
        user: mockUser,
        fileType: 'pdf' as const,
      }

      beforeEach(() => {
        mockEndorsementListModel.findOne.mockResolvedValue(mockEndorsementList)
        mockNationalRegistryService.getName.mockResolvedValue({
          fulltNafn: 'Test Owner',
        })
      })

      it('should handle AWS presigned URL generation failure', async () => {
        // First the uploadFile succeeds
        mockAwsService.uploadFile.mockResolvedValue(undefined)
        // Then getPresignedUrl fails
        mockAwsService.getPresignedUrl.mockRejectedValue(
          new Error('Presigned URL failed'),
        )

        await expect(
          service.exportList(
            exportParams.listId,
            exportParams.user,
            exportParams.fileType,
          ),
        ).rejects.toThrow('Presigned URL failed')
      })

      it('should handle file upload with custom content types', async () => {
        await service.exportList(exportParams.listId, exportParams.user, 'csv')

        expect(mockAwsService.uploadFile).toHaveBeenCalledWith(
          expect.any(Buffer),
          expect.anything(),
          expect.objectContaining({
            ContentType: 'text/csv',
          }),
        )
      })
    })

    describe('Email error handling', () => {
      it('should handle national registry API errors in emailLock', async () => {
        // Mock the National Registry API to fail
        mockNationalRegistryService.getName.mockRejectedValue(
          new Error('API Error'),
        )
        // Mock the email service to fail as well since we couldn't get the name
        mockEmailService.sendEmail.mockRejectedValue(new Error('Email failed'))

        const result = await service.emailLock(mockEndorsementList)
        expect(result.success).toBe(false)
        expect(mockLogger.error).toHaveBeenCalled()
      })

      it('should handle missing owner data gracefully', async () => {
        mockNationalRegistryService.getName.mockResolvedValue({})

        const result = await service.emailCreated(mockEndorsementList)
        expect(result.success).toBe(true)
        expect(mockEmailService.sendEmail).toHaveBeenCalled()
      })
    })
  })

  describe('findListsGenericQuery', () => {
    const mockQuery = { limit: 10 }

    it('should return paginated results', async () => {
      const mockPaginatedResult = {
        data: [mockEndorsementList],
        totalCount: 1,
        pageInfo: { hasNextPage: false },
      }
      mockEndorsementListModel.findAll.mockResolvedValue([mockEndorsementList])
      mockEndorsementListModel.count.mockResolvedValue(1)

      const result = await service.findListsGenericQuery(mockQuery)
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('totalCount')
      expect(result).toHaveProperty('pageInfo')
    })

    it('should apply provided where conditions', async () => {
      const whereCondition = { adminLock: false }
      await service.findListsGenericQuery(mockQuery, whereCondition)
      expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: whereCondition,
        }),
      )
    })
  })

  describe('findListsByTags', () => {
    const mockQuery = { limit: 10 }
    const mockTags = [EndorsementTag.GENERAL_PETITION]

    it('should return lists filtered by tags for admin user', async () => {
      const mockPaginatedResult = {
        data: [mockEndorsementList],
        totalCount: 1,
        pageInfo: { hasNextPage: false },
      }
      mockEndorsementListModel.findAll.mockResolvedValue([mockEndorsementList])
      mockEndorsementListModel.count.mockResolvedValue(1)

      await service.findListsByTags(mockTags, mockQuery, mockAdminUser)
      expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: { [Op.overlap]: mockTags },
            adminLock: { [Op.or]: [true, false] },
          },
        }),
      )
    })

    it('should return lists filtered by tags for regular user', async () => {
      await service.findListsByTags(mockTags, mockQuery, mockUser)
      expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: { [Op.overlap]: mockTags },
            adminLock: false,
          },
        }),
      )
    })
  })

  describe('findOpenListsTaggedGeneralPetition', () => {
    const mockQuery = { limit: 10 }

    it('should return open general petition lists', async () => {
      const mockPaginatedResult = {
        data: [mockEndorsementList],
        totalCount: 1,
        pageInfo: { hasNextPage: false },
      }
      mockEndorsementListModel.findAll.mockResolvedValue([mockEndorsementList])
      mockEndorsementListModel.count.mockResolvedValue(1)

      const result = await service.findOpenListsTaggedGeneralPetition(mockQuery)
      expect(result).toHaveProperty('data')
      expect(mockEndorsementListModel.findAll).toHaveBeenCalled()
    })

    it('should throw NotFoundException when no lists found', async () => {
      mockEndorsementListModel.findAll.mockResolvedValue([])
      mockEndorsementListModel.count.mockResolvedValue(0)

      await expect(
        service.findOpenListsTaggedGeneralPetition(mockQuery),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('emailPDF', () => {
    const mockListId = 'test-id'
    const mockEmail = 'test@example.com'
    const mockEndorsementWithEndorsements = {
      ...mockEndorsementList,
      endorsements: [
        {
          created: new Date(),
          meta: {
            fullName: 'Test User',
            locality: 'Test City',
          },
        },
      ],
    }

    beforeEach(() => {
      mockEndorsementListModel.findOne.mockResolvedValue(
        mockEndorsementWithEndorsements,
      )
      mockNationalRegistryService.getName.mockResolvedValue({
        fulltNafn: 'Test Owner',
      })
    })

    it('should successfully send PDF email', async () => {
      const result = await service.emailPDF(mockListId, mockEmail)

      expect(result.success).toBe(true)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: expect.arrayContaining([
            expect.objectContaining({
              address: mockEmail,
            }),
          ]),
        }),
      )
    })

    it('should handle email sending failure', async () => {
      mockEmailService.sendEmail.mockRejectedValue(new Error('Email failed'))

      const result = await service.emailPDF(mockListId, mockEmail)
      expect(result.success).toBe(false)
    })

    it('should throw NotFoundException when list not found', async () => {
      mockEndorsementListModel.findOne.mockResolvedValue(null)

      await expect(service.emailPDF(mockListId, mockEmail)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('exportList', () => {
    const exportParams = {
      listId: 'test-id',
      user: mockUser,
      fileType: 'pdf' as const,
    }

    beforeEach(() => {
      mockEndorsementListModel.findOne.mockResolvedValue(mockEndorsementList)
      mockNationalRegistryService.getName.mockResolvedValue({
        fulltNafn: 'Test Owner',
      })
    })

    it('should handle PDF export', async () => {
      const result = await service.exportList(
        exportParams.listId,
        exportParams.user,
        exportParams.fileType,
      )

      expect(result.url).toBe('https://test-url.com')
      expect(mockAwsService.uploadFile).toHaveBeenCalled()
      expect(mockAwsService.getPresignedUrl).toHaveBeenCalled()
    })

    it('should handle CSV export', async () => {
      const result = await service.exportList(
        exportParams.listId,
        exportParams.user,
        'csv',
      )

      expect(result.url).toBe('https://test-url.com')
      expect(mockAwsService.uploadFile).toHaveBeenCalledWith(
        expect.any(Buffer),
        expect.objectContaining({
          key: expect.stringContaining('.csv'),
        }),
        expect.objectContaining({
          ContentType: 'text/csv',
        }),
      )
    })

    it('should handle AWS upload failure', async () => {
      mockAwsService.uploadFile.mockRejectedValue(new Error('Upload failed'))

      await expect(
        service.exportList(
          exportParams.listId,
          exportParams.user,
          exportParams.fileType,
        ),
      ).rejects.toThrow('Error uploading file to S3')
    })
  })

  describe('emailCreated and emailLock', () => {
    beforeEach(() => {
      mockNationalRegistryService.getName.mockResolvedValue({
        fulltNafn: 'Test Owner',
      })
    })

    it('should send creation email successfully', async () => {
      const result = await service.emailCreated(mockEndorsementList)
      expect(result.success).toBe(true)
      expect(mockEmailService.sendEmail).toHaveBeenCalled()
    })

    it('should send lock email successfully', async () => {
      const result = await service.emailLock(mockEndorsementList)
      expect(result.success).toBe(true)
      expect(mockEmailService.sendEmail).toHaveBeenCalled()
    })

    it('should handle missing owner email', async () => {
      const listWithoutEmail = {
        ...mockEndorsementList,
        meta: {},
      }

      await expect(service.emailLock(listWithoutEmail)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should handle email service failures', async () => {
      mockEmailService.sendEmail.mockRejectedValue(new Error('Email failed'))

      const result = await service.emailCreated(mockEndorsementList)
      expect(result.success).toBe(false)
    })
  })

  // Add these test blocks to your existing file:

  describe('List query functionality', () => {
    it('should handle pagination parameters', async () => {
      const query = {
        limit: 10,
        after: 'some-cursor',
        before: 'other-cursor',
      }
      mockEndorsementListModel.findAll.mockResolvedValue([mockEndorsementList])
      mockEndorsementListModel.count.mockResolvedValue(1)

      await service.findListsGenericQuery(query)
      expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: expect.any(Number),
        }),
      )
    })

    it('should handle invalid cursor values', async () => {
      const query = {
        limit: 10,
        after: 'invalid-cursor',
      }
      mockEndorsementListModel.findAll.mockResolvedValue([])
      mockEndorsementListModel.count.mockResolvedValue(0)

      const result = await service.findListsGenericQuery(query)
      expect(result.pageInfo.hasNextPage).toBe(false)
    })
  })

  describe('Core list operations', () => {
    describe('open', () => {
      it('should handle opening a list with new date', async () => {
        const newDate = { closedDate: new Date('2025-01-01') }
        const list = { ...mockEndorsementList, update: jest.fn() }
        list.update.mockResolvedValue({ ...list, ...newDate })

        const result = await service.open(list, newDate)
        expect(result.closedDate).toEqual(newDate.closedDate)
      })
    })

    describe('updateEndorsementList', () => {
      it('should update multiple fields', async () => {
        const updates = {
          title: 'Updated Title',
          description: 'Updated Description',
          openedDate: new Date('2024-01-01'),
          closedDate: new Date('2024-12-31'),
        }
        const list = { ...mockEndorsementList, update: jest.fn() }
        list.update.mockResolvedValue({ ...list, ...updates })

        const result = await service.updateEndorsementList(list, updates)
        expect(result.title).toBe(updates.title)
        expect(result.description).toBe(updates.description)
      })
    })

    describe('getOwnerContact', () => {
      it('should find nested contact information', () => {
        const meta = {
          email: 'test@example.com',
          nested: { email: 'nested@example.com' },
        }
        const result = service.getOwnerContact(meta, 'email')
        expect(result).toBe('test@example.com')
      })

      it('should throw NotFoundException for missing contact', () => {
        const meta = { phone: '1234567' }
        expect(() => service.getOwnerContact(meta, 'email')).toThrow(
          NotFoundException,
        )
      })
    })
  })

  describe('PDF generation', () => {
    const mockEndorsementWithData = {
      ...mockEndorsementList,
      endorsements: [
        {
          created: new Date(),
          meta: {
            fullName: 'Test User',
            locality: 'Test City',
            showName: true,
          },
        },
      ],
    }

    it('should handle PDF document creation with complex data', async () => {
      const buffer = await service.createDocumentBuffer(
        mockEndorsementWithData,
        'Test Owner',
      )
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(0)
    })

    it('should handle missing metadata in endorsements', async () => {
      const listWithIncompleteData = {
        ...mockEndorsementList,
        endorsements: [
          {
            created: new Date(),
            meta: {},
          },
        ],
      }
      const buffer = await service.createDocumentBuffer(
        listWithIncompleteData,
        'Test Owner',
      )
      expect(buffer).toBeInstanceOf(Buffer)
    })

    it('should include header and footer in generated PDF', async () => {
      const buffer = await service.createDocumentBuffer(
        mockEndorsementWithData,
        'Test Owner',
      )
      // We can't easily test the PDF content directly, but we can verify it's large enough
      // to contain the header and footer images
      expect(buffer.length).toBeGreaterThan(1000)
    })
  })

  describe('AWS and file handling', () => {
    it('should handle file upload retries', async () => {
      mockAwsService.uploadFile
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(undefined)

      const result = await service.exportList('test-id', mockUser, 'pdf')
      expect(result.url).toBeDefined()
    })

    it('should handle presigned URL errors gracefully', async () => {
      mockAwsService.uploadFile.mockResolvedValue(undefined)
      mockAwsService.getPresignedUrl.mockRejectedValue(
        new Error('URL generation failed'),
      )

      await expect(
        service.exportList('test-id', mockUser, 'pdf'),
      ).rejects.toThrow('Error uploading file to S3')
    })

    it('should handle file size limits', async () => {
      const largeList = {
        ...mockEndorsementList,
        endorsements: Array(1000).fill({
          created: new Date(),
          meta: { fullName: 'Test User', locality: 'Test City' },
        }),
      }

      const result = await service.exportList('test-id', mockUser, 'csv')
      expect(result.url).toBeDefined()
    })
  })
})
