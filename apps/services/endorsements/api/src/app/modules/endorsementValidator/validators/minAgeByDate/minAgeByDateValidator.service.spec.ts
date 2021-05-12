import { Test } from '@nestjs/testing'
import {
  MinAgeByDateInput,
  MinAgeByDateValidatorService,
} from './minAgeByDateValidator.service'

const getNestModule = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [MinAgeByDateValidatorService],
  }).compile()

  return moduleRef.get<MinAgeByDateValidatorService>(
    MinAgeByDateValidatorService,
  )
}

describe('minAgeByDateValidator', () => {
  let minAgeByDateValidatorService: MinAgeByDateValidatorService

  beforeEach(async () => {
    minAgeByDateValidatorService = await getNestModule()
  })

  it('should return success when national id has correct age', async () => {
    const input: MinAgeByDateInput = {
      value: {
        age: 30,
        date: '2021-04-15T00:00:00Z',
      },
      meta: {
        nationalId: '0101302989',
      },
    }
    const results = await minAgeByDateValidatorService.validate(input)
    expect(results).toBeTruthy()
  })
  it('should return failure when national id is to young age', async () => {
    const input: MinAgeByDateInput = {
      value: {
        age: 100,
        date: '2021-04-15T00:00:00Z',
      },
      meta: {
        nationalId: '0101302989',
      },
    }
    const results = await minAgeByDateValidatorService.validate(input)
    expect(results).toBeFalsy()
  })
  it('should return failure when national id is correct age on birthday', async () => {
    const input: MinAgeByDateInput = {
      value: {
        age: 91,
        date: '2021-01-01T00:00:00Z',
      },
      meta: {
        nationalId: '0101302989',
      },
    }
    const results = await minAgeByDateValidatorService.validate(input)
    expect(results).toBeFalsy()
  })
})
