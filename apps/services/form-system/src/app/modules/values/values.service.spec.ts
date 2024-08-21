import { Test, TestingModule } from '@nestjs/testing';
import { ValuesService } from './values.service';

describe('ValuesService', () => {
  let service: ValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValuesService],
    }).compile();

    service = module.get<ValuesService>(ValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
