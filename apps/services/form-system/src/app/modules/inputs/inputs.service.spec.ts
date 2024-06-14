import { Test, TestingModule } from '@nestjs/testing';
import { InputsService } from './inputs.service';

describe('InputsService', () => {
  let service: InputsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InputsService],
    }).compile();

    service = module.get<InputsService>(InputsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
