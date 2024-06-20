import { BadRequestException } from '@nestjs/common'
import { parsePhoneNumber } from 'libphonenumber-js'

/**
 * Validates and formats a phone number to the format +354-7654321
 * Currently, we only support Icelandic numbers due to SMS service and costs.
 *
 * @param phoneNumber
 */
export const formatPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber) {
    return ''
  }

  const tempPhoneNumber = parsePhoneNumber(phoneNumber, 'IS')

  if (tempPhoneNumber?.isValid()) {
    if (tempPhoneNumber.countryCallingCode !== '354') {
      throw new BadRequestException('Phone number must be Icelandic')
    }

    return [
      `+${tempPhoneNumber.countryCallingCode}`,
      tempPhoneNumber.nationalNumber,
    ].join('-')
  }

  throw new BadRequestException('Phone number is invalid')
}
