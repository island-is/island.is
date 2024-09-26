import { Test, TestingModule } from '@nestjs/testing';
import { CertificationsService } from './certifications.service';

describe('CertificationsService', () => {
  let service: CertificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificationsService],
    }).compile();

    service = module.get<CertificationsService>(CertificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
