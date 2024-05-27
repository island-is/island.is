import { Test, TestingModule } from '@nestjs/testing';
import { StepService } from './step.service';

describe('StepService', () => {
  let service: StepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StepService],
    }).compile();

    service = module.get<StepService>(StepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
