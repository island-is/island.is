import { faker } from '@faker-js/faker'

/**
 * Creates a random `length` digit verification code as a string
 * @param length Controls the number of digit in the verification code
 */
export const createVerificationCode = (length = 3) =>
  faker.string.numeric(length).toString()
