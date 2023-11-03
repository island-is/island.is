import faker from 'faker'

/**
 * Creates a random 7 digit phone number
 */
export const createPhoneNumber = () => faker.phone.phoneNumber('7######')
