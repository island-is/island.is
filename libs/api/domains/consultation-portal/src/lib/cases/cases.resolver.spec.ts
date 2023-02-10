import { Test, TestingModule } from '@nestjs/testing'
import { CaseResolver } from './cases.resolver'
import { CaseResultService } from './cases.service'

describe('ApiDomains: CaseResolver', () => {
  let resolver: CaseResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaseResolver,
        {
          provide: CaseResultService,
          useFactory: () => ({
            // Is there a nicer way to mock a service while keeping some of its methods unchanged?
            getAllCases: CaseResultService.prototype.getAllCases,
          }),
        },
      ],
    }).compile()

    resolver = module.get<CaseResolver>(CaseResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
