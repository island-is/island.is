import { Test, TestingModule } from '@nestjs/testing';
import { StepController } from './step.controller';

describe('StepController', () => {
  let controller: StepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StepController],
    }).compile();

    controller = module.get<StepController>(StepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
