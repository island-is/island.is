import { Test, TestingModule } from '@nestjs/testing';
import { CourtService } from './court.service';

describe('CourtService', () => {
  let service: CourtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtService],
    }).compile();

    service = module.get<CourtService>(CourtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
