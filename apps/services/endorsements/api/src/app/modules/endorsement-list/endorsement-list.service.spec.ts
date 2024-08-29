import { Test, TestingModule } from '@nestjs/testing';
import { EndorsementListService } from './endorsement-list.service';
import { getModelToken } from '@nestjs/sequelize';
import { EndorsementList } from './endorsement-list.model';
import { Endorsement } from '../endorsement/models/endorsement.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EmailService } from '@island.is/email-service';
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3';
import { AwsService } from '@island.is/nest/aws';
import { LOGGER_PROVIDER } from '@island.is/logging';
import { AdminPortalScope } from '@island.is/auth/scopes';

// Mocking Sequelize models
const mockEndorsementListModel = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockEndorsementModel = {
  findAll: jest.fn(),
};

// Mocking external services
const mockEmailService = {
  sendEmail: jest.fn(),
};

const mockNationalRegistryService = {
  getName: jest.fn(),
};

const mockAwsService = {
  getPresignedUrl: jest.fn(),
  uploadFile: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('EndorsementListService', () => {
    let service: EndorsementListService;
  
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
          {
            provide: EmailService,
            useValue: mockEmailService,
          },
          {
            provide: NationalRegistryV3ClientService,
            useValue: mockNationalRegistryService,
          },
          {
            provide: AwsService,
            useValue: mockAwsService,
          },
          {
            provide: LOGGER_PROVIDER,
            useValue: mockLogger,
          },
        ],
      }).compile();
  
      service = module.get<EndorsementListService>(EndorsementListService);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('hasAdminScope', () => {
      it('should return true if user has admin scope', () => {
        const user = { scope: [AdminPortalScope.petitionsAdmin] } as any;
        expect(service.hasAdminScope(user)).toBe(true);
      });
  
      it('should return false if user does not have admin scope', () => {
        const user = { scope: [] } as any;
        expect(service.hasAdminScope(user)).toBe(false);
      });

    });
  
    describe('getListOwnerNationalId', () => {
      it('should return the ownerNationalId if the list is found', async () => {
        const listId = 'some-list-id';
        const mockList = { id: listId, ownerNationalId: '1234567890' };
        mockEndorsementListModel.findOne.mockResolvedValue(mockList);
  
        const result = await service.getListOwnerNationalId(listId);
  
        expect(result).toEqual('1234567890');
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith({
          where: { id: listId },
        });
      });
  
      it('should return null if the list is not found', async () => {
        const listId = 'non-existent-list-id';
        mockEndorsementListModel.findOne.mockResolvedValue(null);
  
        const result = await service.getListOwnerNationalId(listId);
  
        expect(result).toBeNull();
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith({
          where: { id: listId },
        });
      });
    });
  
    describe('populateOwnerNamesForExistingLists', () => {
      it('should populate owner names for lists without an ownerName', async () => {
        const lists = [{ ownerNationalId: '1234567890', ownerName: '', save: jest.fn() }];
        const ownerName = 'Test Owner';
  
        mockEndorsementListModel.findAll.mockResolvedValue(lists);
        mockNationalRegistryService.getName.mockResolvedValue({ fulltNafn: ownerName });
  
        await service.populateOwnerNamesForExistingLists();
  
        expect(mockEndorsementListModel.findAll).toHaveBeenCalledWith({
          where: { ownerName: '' },
        });
        expect(lists[0].save).toHaveBeenCalled();
      });
    });
  
    describe('findListsByTags', () => {
      it('should find lists by tags with admin access', async () => {
        const user = { scope: [AdminPortalScope.petitionsAdmin] } as any;
        const tags = ['tag1', 'tag2'];
        const query = { limit: 10 };
  
        await service.findListsByTags(tags, query, user);
  
        expect(mockEndorsementListModel.findAll).toHaveBeenCalled();
      });
  
      it('should find lists by tags without admin access', async () => {
        const user = { scope: [] } as any;
        const tags = ['tag1', 'tag2'];
        const query = { limit: 10 };
  
        await service.findListsByTags(tags, query, user);
  
        expect(mockEndorsementListModel.findAll).toHaveBeenCalled();
      });
    });
  
    describe('findSingleList', () => {
      it('should return a list if found', async () => {
        const listId = 'some-list-id';
        const mockList = { id: listId };
        mockEndorsementListModel.findOne.mockResolvedValue(mockList);
  
        const result = await service.findSingleList(listId);
  
        expect(result).toEqual(mockList);
        expect(mockEndorsementListModel.findOne).toHaveBeenCalledWith({
          where: { id: listId, adminLock: false },
        });
      });
  
      it('should throw NotFoundException if list is not found', async () => {
        const listId = 'non-existent-list-id';
        mockEndorsementListModel.findOne.mockResolvedValue(null);
  
        await expect(service.findSingleList(listId)).rejects.toThrow(NotFoundException);
        expect(mockLogger.warn).toHaveBeenCalledWith('This endorsement list does not exist.');
      });
    });
  
    describe('close', () => {
      it('should close an endorsement list and return it', async () => {
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        endorsementList.update.mockResolvedValue(endorsementList);
  
        const result = await service.close(endorsementList);
  
        expect(result).toEqual(endorsementList);
        expect(endorsementList.update).toHaveBeenCalledWith({ closedDate: expect.any(Date) });
        expect(mockLogger.info).toHaveBeenCalledWith(`Closing endorsement list: ${endorsementList.id}`);
      });
    });
  
    describe('open', () => {
      it('should open an endorsement list and update closed date', async () => {
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        const newDate = { closedDate: new Date('2024-01-01') };
  
        endorsementList.update.mockResolvedValue(endorsementList);
  
        const result = await service.open(endorsementList, newDate);
  
        expect(result).toEqual(endorsementList);
        expect(endorsementList.update).toHaveBeenCalledWith({ closedDate: newDate.closedDate });
        expect(mockLogger.info).toHaveBeenCalledWith(`Opening endorsement list: ${endorsementList.id}`);
      });
    });
  
    describe('lock', () => {
      it('should lock an endorsement list and return it', async () => {
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        endorsementList.update.mockResolvedValue(endorsementList);
  
        const result = await service.lock(endorsementList);
  
        expect(result).toEqual(endorsementList);
        expect(endorsementList.update).toHaveBeenCalledWith({ adminLock: true });
        expect(mockLogger.info).toHaveBeenCalledWith(`Locking endorsement list: ${endorsementList.id}`);
      });
  
      it('should send an email if in production', async () => {
        process.env.NODE_ENV = 'production';
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        endorsementList.update.mockResolvedValue(endorsementList);
  
        await service.lock(endorsementList);
  
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
      });
    });
  
    describe('unlock', () => {
      it('should unlock an endorsement list and return it', async () => {
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        endorsementList.update.mockResolvedValue(endorsementList);
  
        const result = await service.unlock(endorsementList);
  
        expect(result).toEqual(endorsementList);
        expect(endorsementList.update).toHaveBeenCalledWith({ adminLock: false });
        expect(mockLogger.info).toHaveBeenCalledWith(`Unlocking endorsement list: ${endorsementList.id}`);
      });
    });
  
    describe('updateEndorsementList', () => {
      it('should update an endorsement list with new data and return it', async () => {
        const endorsementList = { id: 'some-id', update: jest.fn() } as any;
        const newData = { title: 'New Title' } as any;
        endorsementList.update.mockResolvedValue({ ...endorsementList, ...newData });
  
        const result = await service.updateEndorsementList(endorsementList, newData);
  
        expect(result).toEqual({ ...endorsementList, ...newData });
        expect(endorsementList.update).toHaveBeenCalledWith({ ...endorsementList, ...newData });
        expect(mockLogger.info).toHaveBeenCalledWith(`Updating endorsement list: ${endorsementList.id}`);
      });
    });
  
    describe('create', () => {
      it('should throw BadRequestException if openedDate or closedDate is missing', async () => {
        const input = { title: 'Test List' } as any;
  
        await expect(service.create(input)).rejects.toThrow(BadRequestException);
        expect(mockLogger.warn).toHaveBeenCalledWith('Body missing openedDate or closedDate value.');
      });
  
      it('should throw BadRequestException if openedDate is after closedDate', async () => {
        const input = {
          title: 'Test List',
          openedDate: new Date('2024-01-02'),
          closedDate: new Date('2024-01-01'),
          ownerNationalId: '1234567890',
        };
  
        await expect(service.create(input)).rejects.toThrow(BadRequestException);
        expect(mockLogger.warn).toHaveBeenCalledWith('openedDate can not be bigger than closedDate.');
      });
  
      it('should throw BadRequestException if closedDate has already passed', async () => {
        const input = {
          title: 'Test List',
          openedDate: new Date('2023-01-01'),
          closedDate: new Date('2023-01-02'),
          ownerNationalId: '1234567890',
        };
  
        jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-01-01T00:00:00Z') as any);
  
        await expect(service.create(input)).rejects.toThrow(BadRequestException);
        expect(mockLogger.warn).toHaveBeenCalledWith('closedDate can not have already passed on creation of Endorsement List');
      });
  
      it('should create a new endorsement list and return it', async () => {
        const input = {
          title: 'Test List',
          openedDate: new Date('2024-01-01'),
          closedDate: new Date('2024-01-02'),
          ownerNationalId: '1234567890',
        };
        const ownerName = 'Test Owner';
        const mockList = { ...input, ownerName };
        mockNationalRegistryService.getName.mockResolvedValue({ fulltNafn: ownerName });
        mockEndorsementListModel.create.mockResolvedValue(mockList);
  
        const result = await service.create(input);
  
        expect(result).toEqual(mockList);
        expect(mockEndorsementListModel.create).toHaveBeenCalledWith({
          ...input,
          ownerName,
        });
        expect(mockLogger.info).toHaveBeenCalledWith('Creating endorsement list: Test List');
      });
    });
  
    describe('getOwnerName', () => {
      it('should return the owner name if found in National Registry', async () => {
        const ownerNationalId = '1234567890';
        const mockName = { fulltNafn: 'Test Owner' };
        mockNationalRegistryService.getName.mockResolvedValue(mockName);
  
        const result = await service.getOwnerName(ownerNationalId);
  
        expect(result).toEqual('Test Owner');
        expect(mockNationalRegistryService.getName).toHaveBeenCalledWith(ownerNationalId);
      });
  
      it('should throw BadRequestException if National Registry lookup fails', async () => {
        const ownerNationalId = 'invalid-id';
        mockNationalRegistryService.getName.mockRejectedValue(new Error('Lookup failed'));
  
        await expect(service.getOwnerName(ownerNationalId)).rejects.toThrow(BadRequestException);
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Error fetching owner name from NationalRegistryApi: Lookup failed'
        );
      });
    });
  
    describe('emailPDF', () => {
      it('should email a PDF of the endorsement list', async () => {
        const listId = 'some-list-id';
        const recipientEmail = 'test@example.com';
        const mockList = { id: listId, title: 'Test List', ownerNationalId: '1234567890', endorsements: [] };
        mockEndorsementListModel.findOne.mockResolvedValue(mockList);
        mockEmailService.sendEmail.mockResolvedValue({});
  
        const result = await service.emailPDF(listId, recipientEmail);
  
        expect(result).toEqual({ success: true });
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
        expect(mockLogger.info).toHaveBeenCalledWith(`sending list ${listId} to ${recipientEmail} from ${environment.email.sender}`);
      });
  
      it('should throw NotFoundException if list is not found', async () => {
        const listId = 'non-existent-list-id';
        mockEndorsementListModel.findOne.mockResolvedValue(null);
  
        await expect(service.emailPDF(listId, 'test@example.com')).rejects.toThrow(NotFoundException);
        expect(mockLogger.warn).toHaveBeenCalledWith('This endorsement list does not exist.');
      });
  
      it('should return success false if email fails to send', async () => {
        const listId = 'some-list-id';
        const recipientEmail = 'test@example.com';
        const mockList = { id: listId, title: 'Test List', ownerNationalId: '1234567890', endorsements: [] };
        mockEndorsementListModel.findOne.mockResolvedValue(mockList);
        mockEmailService.sendEmail.mockRejectedValue(new Error('Email failed'));
  
        const result = await service.emailPDF(listId, recipientEmail);
  
        expect(result).toEqual({ success: false });
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to send email', expect.any(Error));
      });
    });
  
    describe('exportList', () => {
      it('should export a list as a PDF or CSV and return a presigned URL', async () => {
        const listId = 'some-list-id';
        const user = { scope: [AdminPortalScope.petitionsAdmin] } as any;
        const fileType = 'pdf';
        const mockList = { id: listId, endorsements: [] } as any;
  
        mockEndorsementListModel.findOne.mockResolvedValue(mockList);
        mockAwsService.getPresignedUrl.mockResolvedValue('https://example.com/file.pdf');
  
        const result = await service.exportList(listId, user, fileType);
  
        expect(result).toEqual({ url: 'https://example.com/file.pdf' });
        expect(mockAwsService.getPresignedUrl).toHaveBeenCalled();
      });
  
      it('should throw BadRequestException for invalid file type', async () => {
        const listId = 'some-list-id';
        const user = { scope: [AdminPortalScope.petitionsAdmin] } as any;
        const fileType = 'invalid';
  
        await expect(service.exportList(listId, user, fileType)).rejects.toThrow(BadRequestException);
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to export list some-list-id', expect.any(Object));
      });
  
      it('should throw NotFoundException if list is not found or access denied', async () => {
        const listId = 'non-existent-list-id';
        const user = { scope: [AdminPortalScope.petitionsAdmin] } as any;
        const fileType = 'pdf';
  
        mockEndorsementListModel.findOne.mockResolvedValue(null);
  
        await expect(service.exportList(listId, user, fileType)).rejects.toThrow(NotFoundException);
        expect(mockLogger.error).toHaveBeenCalledWith('Failed to export list non-existent-list-id', expect.any(Object));
      });
    });
  
    describe('getOwnerContact', () => {
      it('should return the contact information if found', () => {
        const obj = { email: 'test@example.com' };
        const search = 'email';
        const result = service.getOwnerContact(obj, search);
  
        expect(result).toEqual('test@example.com');
      });
  
      it('should throw NotFoundException if contact information is not found', () => {
        const obj = { email: 'test@example.com' };
        const search = 'phone';
  
        expect(() => service.getOwnerContact(obj, search)).toThrow(NotFoundException);
        expect(mockLogger.warn).toHaveBeenCalledWith('This endorsement list does not include owner email.');
      });
    });
  });
  
  