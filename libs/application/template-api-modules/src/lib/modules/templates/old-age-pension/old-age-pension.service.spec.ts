import { Test, TestingModule } from '@nestjs/testing';
import { OldAgePensionService } from './old-age-pension.service';


describe('OldAgePensionService', () => {
  let service: OldAgePensionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OldAgePensionService],
    }).compile();

    service = module.get<OldAgePensionService>(OldAgePensionService);
  }).compile();

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  
});
