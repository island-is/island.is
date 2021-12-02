import { Test, TestingModule } from '@nestjs/testing';
import { UserNotificationsService } from './user-notifications.service';

describe('UserNotificationsService', () => {
  let service: UserNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserNotificationsService],
    }).compile();

    service = module.get<UserNotificationsService>(UserNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
