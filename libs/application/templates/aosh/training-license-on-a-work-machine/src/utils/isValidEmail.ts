import { EMAIL_REGEX } from '@island.is/application/core'

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
