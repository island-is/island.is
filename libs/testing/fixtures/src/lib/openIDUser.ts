/* eslint-disable @typescript-eslint/naming-convention */

import { faker } from '@faker-js/faker'
import kennitala from 'kennitala'

import { User } from '@island.is/shared/types'
import { createNationalId } from './nationalId'

const createRandomOpenIDUser = (): User => {
  const [firstName, middleName, lastName] = [
    faker.person.firstName(),
    faker.person.middleName(),
    faker.person.lastName(),
  ]
  const nationalId = createNationalId()
  const subjectType = kennitala.isCompany(nationalId) ? 'legalEntity' : 'person'

  return {
    id_token: faker.word.sample(),
    access_token: faker.word.sample(),
    token_type: faker.word.sample(),
    scope: faker.word.sample(),
    profile: {
      name: `${firstName} ${middleName} ${lastName}`,
      nationalId,
      subjectType,
      given_name: firstName,
      family_name: lastName,
      nickname: faker.person.fullName(),
      preferred_username: faker.internet.userName(),
      profile: faker.image.avatar(),
      picture: faker.image.avatar(),
      phone_number: faker.string.numeric(7),
      phone_number_verified: faker.datatype.boolean(),
      email: faker.internet.email(),
      iss: faker.word.sample(),
      sub: faker.word.sample(),
      aud: faker.word.sample(),
      exp: faker.number.int(),
      iat: faker.number.int(),
      nat: faker.word.sample(),
      idp: faker.word.sample(),
      nonce: faker.word.sample(),
    },
    expires_at: faker.number.int(),
    state: faker.word.sample(),
    session_state: faker.word.sample(),
    toStorageString: () => '',
    expires_in: faker.number.int(),
    expired: faker.datatype.boolean(),
    scopes: [],
  }
}

export const createOpenIDUser = (
  user: User = createRandomOpenIDUser(),
): User => {
  const fallback = createRandomOpenIDUser()

  const {
    id_token = user['id_token'] ?? fallback['id_token'],
    access_token = user['access_token'] ?? fallback['access_token'],
    token_type = user['token_type'] ?? fallback['token_type'],
    scope = user['scope'] ?? fallback['scope'],
    profile = user['profile'] ?? fallback['profile'],
    expires_at = user['expires_at'] ?? fallback['expires_at'],
    state = user['state'] ?? fallback['state'],
    toStorageString = user['toStorageString'] ?? fallback['toStorageString'],
    expires_in = user['expires_in'] ?? fallback['expires_in'],
    expired = user['expired'] ?? fallback['expired'],
    scopes = user['scopes'] ?? fallback['scopes'],
    session_state = user['session_state'] ?? fallback['session_state'],
  } = user

  return {
    id_token,
    access_token,
    token_type,
    scope,
    profile,
    expires_at,
    state,
    toStorageString,
    expires_in,
    expired,
    scopes,
    session_state,
  }
}
