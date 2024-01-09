import faker from 'faker'

/**
 * Creates a random `length` digit verification code as a string
 * @param length Controls the number of digit in the verification code
 */
export const createVerificationCode = (length = 3) =>
  faker.datatype
    .number({
      min: Math.pow(10, length - 1),
      max: Math.pow(10, length) - 1,
    })
    .toString()
