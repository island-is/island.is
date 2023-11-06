import faker from 'faker'

/**
 * Creates a random 7 digit phone number that starts with 7 to satisfy the Icelandic phone number format
 */
export const createPhoneNumber = () => faker.phone.phoneNumber('7######')
