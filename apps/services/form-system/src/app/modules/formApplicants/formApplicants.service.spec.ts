import { Test, TestingModule } from '@nestjs/testing'
import { FormApplicantsService } from './formApplicants.service'

describe('FormApplicantsService', () => {
  let service: FormApplicantsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormApplicantsService],
    }).compile()

    service = module.get<FormApplicantsService>(FormApplicantsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
