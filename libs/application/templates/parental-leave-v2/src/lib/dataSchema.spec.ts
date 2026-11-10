import { validateAnswers } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  ADOPTION,
  BIRTH,
  OTHER_NO_CHILDREN_FOUND,
  PERMANENT_FOSTER_CARE,
} from '../constants'
import { dataSchema } from './dataSchema'

describe('dataSchema fosterCareOrAdoption', () => {
  const fosterCareOrAdoptionSchema = dataSchema.shape.fosterCareOrAdoption

  it('should validate age against the placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2018-04-12',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(true)
  })

  it('should reject children who were already 8 on the placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2017-10-30',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(false)
  })

  it('should reject an empty birth date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(false)
  })

  it('should reject an empty placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2018-04-12',
        adoptionDate: '',
      }).success,
    ).toBe(false)
  })
})

describe('dataSchema noChildrenFound', () => {
  // The application system API validates every saved answer like this, with
  // no notion of which screen it came from.
  const validateOnServer = (answers: FormValue) =>
    validateAnswers({
      dataSchema,
      answers,
      isFullSchemaValidation: false,
      formatMessage: (message) => String(message),
    })

  it.each([BIRTH, PERMANENT_FOSTER_CARE, ADOPTION, OTHER_NO_CHILDREN_FOUND])(
    'should accept picking %s before its own screen is answered',
    (typeOfApplication) => {
      expect(
        validateOnServer({ noChildrenFound: { typeOfApplication } }),
      ).toBeUndefined()
    },
  )

  it('should accept a registry child submitted after trying "Ný umsókn"', () => {
    // Submit sends every answer the form holds, including those of screens the
    // applicant backed out of; switching child clears them to ''.
    expect(
      validateOnServer({
        selectedChild: '0',
        noChildrenFound: { typeOfApplication: OTHER_NO_CHILDREN_FOUND },
        noPrimaryParent: '',
        fosterCareOrAdoption: '',
        newChildBirth: '',
      }),
    ).toBeUndefined()
  })

  it('should still reject an uncleared, unanswered parent without birth parent screen', () => {
    expect(validateOnServer({ noPrimaryParent: {} })).toBeDefined()
  })

  it('should require a birth date on the new birth screen', () => {
    const newChildBirthSchema = dataSchema.shape.newChildBirth

    expect(newChildBirthSchema.safeParse({ birthDate: '' }).success).toBe(false)
    expect(newChildBirthSchema.safeParse({}).success).toBe(false)
    expect(
      newChildBirthSchema.safeParse({ birthDate: '2027-01-15' }).success,
    ).toBe(true)
  })
})

describe('dataSchema multipleBirths', () => {
  const multipleBirthsSchema = dataSchema.shape.multipleBirths

  it('should accept an empty object', () => {
    // The question is conditional — not asked of a secondary parent, nor for a
    // child that already has an application. The object still arrives from the
    // form, just empty, so requiring hasMultipleBirths rejected those cases.
    expect(multipleBirthsSchema.safeParse({}).success).toBe(true)
  })

  it('should treat an empty conditional answer as absent', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: '' }).success,
    ).toBe(true)
  })

  it('should accept being absent entirely', () => {
    expect(multipleBirthsSchema.safeParse(undefined).success).toBe(true)
  })

  it('should still require a count when the answer is yes', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: 'yes' }).success,
    ).toBe(false)
    expect(
      multipleBirthsSchema.safeParse({
        hasMultipleBirths: 'yes',
        multipleBirths: '2',
      }).success,
    ).toBe(true)
  })

  it('should still reject a count below two', () => {
    expect(
      multipleBirthsSchema.safeParse({
        hasMultipleBirths: 'yes',
        multipleBirths: '1',
      }).success,
    ).toBe(false)
  })

  it('should not require a count when the answer is no', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: 'no' }).success,
    ).toBe(true)
  })
})

describe('dataSchema rights days', () => {
  const giveRightsSchema = dataSchema.shape.giveRights
  const requestRightsSchema = dataSchema.shape.requestRights
  const multipleBirthsRequestDaysSchema =
    dataSchema.shape.multipleBirthsRequestDays

  // A negative gift flips sign in `getTransferredDays` and becomes a request.
  it('should reject negative days to give', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '-30' })
        .success,
    ).toBe(false)
  })

  it('should reject negative days to request', () => {
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '-30',
      }).success,
    ).toBe(false)
  })

  it('should reject more days than may be given or requested', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '46' })
        .success,
    ).toBe(false)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '46',
      }).success,
    ).toBe(false)
  })

  it('should reject fractional and empty days', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '1.5' })
        .success,
    ).toBe(false)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '',
      }).success,
    ).toBe(false)
  })

  it('should accept days within the range', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '45' })
        .success,
    ).toBe(true)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '0',
      }).success,
    ).toBe(true)
  })

  it('should bound multiple-birth days, accepting the number VMST seeds', () => {
    expect(multipleBirthsRequestDaysSchema.safeParse('-30').success).toBe(false)
    expect(multipleBirthsRequestDaysSchema.safeParse('100000').success).toBe(
      false,
    )
    expect(multipleBirthsRequestDaysSchema.safeParse('180').success).toBe(true)
    expect(multipleBirthsRequestDaysSchema.safeParse(360).success).toBe(true)
    expect(multipleBirthsRequestDaysSchema.safeParse(undefined).success).toBe(
      true,
    )
  })
})

describe('dataSchema employers ratio', () => {
  const employersSchema = dataSchema.shape.employers
  const withRatio = (ratio: string) => [{ email: 'employer@island.is', ratio }]

  it.each(['0', '', '-10', '101', 'abc'])(
    'should reject a ratio of %p',
    (ratio) => {
      expect(employersSchema.safeParse(withRatio(ratio)).success).toBe(false)
    },
  )

  it.each(['1', '50', '100'])('should accept a ratio of %p', (ratio) => {
    expect(employersSchema.safeParse(withRatio(ratio)).success).toBe(true)
  })
})
