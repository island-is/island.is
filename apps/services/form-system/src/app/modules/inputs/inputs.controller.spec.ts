import { Test, TestingModule } from '@nestjs/testing';
import { InputsController } from './inputs.controller';

describe('InputsController', () => {
  let controller: InputsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InputsController],
    }).compile();

    controller = module.get<InputsController>(InputsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
