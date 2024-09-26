import { Test, TestingModule } from '@nestjs/testing'
import { FormApplicantsController } from './formApplicants.controller'

describe('FormApplicantsController', () => {
  let controller: FormApplicantsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormApplicantsController],
    }).compile()

    controller = module.get<FormApplicantsController>(FormApplicantsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
