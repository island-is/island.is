import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantsController } from './applicants.controller';

describe('ApplicantsController', () => {
  let controller: ApplicantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantsController],
    }).compile();

    controller = module.get<ApplicantsController>(ApplicantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
