import { Test, TestingModule } from '@nestjs/testing';
import { EndorsementListController } from './endorsementList.controller';
import { EndorsementListService } from './endorsementList.service';
import { EndorsementListDto } from './dto/endorsementList.dto';
import { UpdateEndorsementListDto } from './dto/updateEndorsementList.dto';
import { createCurrentUser } from '@island.is/testing/fixtures';
import { EndorsementsScope } from '@island.is/auth/scopes';
import { ChangeEndorsmentListClosedDateDto } from './dto/changeEndorsmentListClosedDate.dto';
import { PaginatedEndorsementListDto } from './dto/paginatedEndorsementList.dto';
import { User } from '@island.is/auth-nest-tools';
import { EndorsementList } from './endorsementList.model';

<<<<<<< HEAD
const mockEndorsementList = {
    id: '1',
    counter: 1,
    title: 'Test List',
    description: 'A test endorsement list',
    openedDate: new Date(),
    closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    endorsementMetadata: [],
    tags: [],
    owner: '1234567890',
    adminLock: false,
    endorsements: [],
    endorsementCounter: 0,
    meta: {},
    created: new Date(),
    modified: new Date(),
    endorsementCount: 0,
  };
  
  
=======
// const mockEndorsementList = {
//     id: '1',
//     counter: 1,
//     title: 'Test List',
//     description: 'A test endorsement list',
//     openedDate: new Date(),
//     closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//     endorsementMetadata: [],
//     tags: [],
//     owner: '1234567890',
//     adminLock: false,
//     endorsements: [],
//     endorsementCounter: 0,
//     meta: {},
//     created: new Date(),
//     modified: new Date(),
//     endorsementCount: 0,
//   };
>>>>>>> 1efcf585525e6ffc881eff529c1031ae1f962722

const paginatedEndorsementListDto: PaginatedEndorsementListDto = {
  totalCount: 1,
  data: [mockEndorsementList as any as EndorsementList],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const createEndorsementListDto = {
  title: 'New Endorsement List',
  description: 'A new endorsement list for testing',
  openedDate: new Date(),
  closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  adminLock: false,

};

const updateEndorsementListDto = {
  title: 'Updated Title',
  description: 'Updated description',
  openedDate: new Date(),
  closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
};

describe('EndorsementListController', () => {
  let endorsementListController: EndorsementListController;
  let endorsementListService: EndorsementListService;
  const user = createCurrentUser({
    scope: [EndorsementsScope.main],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndorsementListController],
      providers: [
        {
          provide: EndorsementListService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockEndorsementList),
            findAllEndorsementListsByNationalId: jest.fn().mockResolvedValue(paginatedEndorsementListDto),
            findListsByTags: jest.fn().mockResolvedValue(paginatedEndorsementListDto),
            findSingleList: jest.fn().mockResolvedValue(mockEndorsementList),
            close: jest.fn().mockResolvedValue(mockEndorsementList),
            open: jest.fn().mockResolvedValue(mockEndorsementList),
            updateEndorsementList: jest.fn().mockResolvedValue(mockEndorsementList),
            lock: jest.fn().mockResolvedValue(mockEndorsementList),
            unlock: jest.fn().mockResolvedValue(mockEndorsementList),
          },
        },
      ],
    }).compile();

    endorsementListController = module.get<EndorsementListController>(EndorsementListController);
    endorsementListService = module.get<EndorsementListService>(EndorsementListService);
  });

  it('should be defined', () => {
    expect(endorsementListController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new endorsement list', async () => {
      const result = await endorsementListController.create(mockEndorsementList, user);
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.create).toHaveBeenCalledWith({
        ...createEndorsementListDto,
        owner: user.nationalId,
      });
    });
  });

  describe('findEndorsementLists()', () => {
    it('should return endorsement lists for the current user', async () => {
      const result = await endorsementListController.findEndorsementLists(user, { limit: 10 });
      expect(result).toEqual(paginatedEndorsementListDto);
      expect(endorsementListService.findAllEndorsementListsByNationalId).toHaveBeenCalledWith(
        user.nationalId,
        { limit: 10 },
      );
    });
  });

  describe('findByTags()', () => {
    it('should return endorsement lists by tags', async () => {
      const result = await endorsementListController.findByTags(user, { tags: ['tag1'], limit: 10 });
      expect(result).toEqual(paginatedEndorsementListDto);
      expect(endorsementListService.findListsByTags).toHaveBeenCalledWith(['tag1'], { limit: 10 }, user);
    });
  });

  describe('findOne()', () => {
    it('should return a single endorsement list', async () => {
      const result = await endorsementListController.findOne('1');
      expect(result).toEqual(mockEndorsementList);
    });
  });

  describe('close()', () => {
    it('should close an endorsement list', async () => {
      const result = await endorsementListController.close('1', mockEndorsementList);
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.close).toHaveBeenCalledWith(mockEndorsementList);
    });
  });

  describe('open()', () => {
    it('should open an endorsement list', async () => {
      const changeDateDto: ChangeEndorsmentListClosedDateDto = {
        closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      };
      const result = await endorsementListController.open(changeDateDto, '1', mockEndorsementList);
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.open).toHaveBeenCalledWith(mockEndorsementList, changeDateDto);
    });
  });

  describe('update()', () => {
    it('should update an endorsement list', async () => {
      const result = await endorsementListController.update(
        updateEndorsementListDto,
        '1',
        mockEndorsementList,
      );
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.updateEndorsementList).toHaveBeenCalledWith(
        mockEndorsementList,
        updateEndorsementListDto,
      );
    });
  });

  describe('lock()', () => {
    it('should lock an endorsement list', async () => {
      const result = await endorsementListController.lock('1', mockEndorsementList);
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.lock).toHaveBeenCalledWith(mockEndorsementList);
    });
  });

  describe('unlock()', () => {
    it('should unlock an endorsement list', async () => {
      const result = await endorsementListController.unlock('1', mockEndorsementList);
      expect(result).toEqual(mockEndorsementList);
      expect(endorsementListService.unlock).toHaveBeenCalledWith(mockEndorsementList);
    });
  });
});
