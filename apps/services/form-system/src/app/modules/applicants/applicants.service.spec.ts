import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantsService } from './applicants.service';

describe('ApplicantsService', () => {
  let service: ApplicantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantsService],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
