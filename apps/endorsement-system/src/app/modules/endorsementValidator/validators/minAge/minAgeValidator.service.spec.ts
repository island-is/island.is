import { Test } from '@nestjs/testing'
import { MinAgeInput, MinAgeValidatorService } from './minAgeValidator.service'

const getNestModule = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [MinAgeValidatorService],
  }).compile()

  return moduleRef.get<MinAgeValidatorService>(MinAgeValidatorService)
}

describe('minAgeValidator', () => {
  let minAgeValidatorService: MinAgeValidatorService

  beforeEach(async () => {
    minAgeValidatorService = await getNestModule()
  })

  it('should return success when national id has correct age', async () => {
    const input: MinAgeInput = {
      value: {
        age: 30,
      },
      meta: {
        nationalId: '0101302989',
      },
    }
    const results = await minAgeValidatorService.validate(input)
    expect(results).toBeTruthy()
  })
  it('should return failure when national id is too young age', async () => {
    const input: MinAgeInput = {
      value: {
        age: 100,
      },
      meta: {
        nationalId: '0101302989',
      },
    }
    const results = await minAgeValidatorService.validate(input)
    expect(results).toBeFalsy()
  })
})
