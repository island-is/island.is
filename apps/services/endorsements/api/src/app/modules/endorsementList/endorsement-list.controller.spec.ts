import { Test, TestingModule } from '@nestjs/testing'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementList } from './endorsementList.model'
import { EndorsementTag } from './constants'

describe('EndorsementListController', () => {
  let controller: EndorsementListController
  let service: EndorsementListService

  const mockEndorsementList = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Petition',
    description: 'This is a test petition',
    owner: '1234567890',
    endorsementCount: 0,
    closed: false,
    closedDate: new Date('2024-12-31'),
    created: new Date(),
    modified: new Date(),
    endorsementMeta: {},
    locked: false,
    tags: [EndorsementTag.GENERAL_PETITION],
    validationRules: {}
  }

  beforeEach(async () => {
    const mockEndorsementListService = {
      findSingleList: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndorsementListController],
      providers: [
        {
          provide: EndorsementListService,
          useValue: mockEndorsementListService
        }
      ]
    }).compile()

    controller = module.get<EndorsementListController>(EndorsementListController)
    service = module.get<EndorsementListService>(EndorsementListService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getGeneralPetitionList', () => {
    it('should return a single general petition list by id', async () => {
      // Arrange
      const listId = '123e4567-e89b-12d3-a456-426614174000'
      jest.spyOn(service, 'findSingleList').mockResolvedValue(mockEndorsementList)

      // Act
      const result = await controller.getGeneralPetitionList(listId)

      // Assert
      expect(result).toEqual(mockEndorsementList)
      expect(service.findSingleList).toHaveBeenCalledWith(listId)
      expect(service.findSingleList).toHaveBeenCalledTimes(1)
    })

    it('should return null when list is not found', async () => {
      // Arrange
      const listId = 'non-existent-id'
      jest.spyOn(service, 'findSingleList').mockResolvedValue(null)

      // Act
      const result = await controller.getGeneralPetitionList(listId)

      // Assert
      expect(result).toBeNull()
      expect(service.findSingleList).toHaveBeenCalledWith(listId)
      expect(service.findSingleList).toHaveBeenCalledTimes(1)
    })
  })
})