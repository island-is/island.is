import { logger } from '@island.is/logging'
import { PreconditionFailedException } from '@nestjs/common'

export const sanitizeInput = (
  input: string,
  validateInput: (input: string) => boolean,
) => {
  if (validateInput(input) === false) {
    logger.warn('Invalid input for personal tax return api')
    throw new PreconditionFailedException('Invalid input')
  }
}

export const isNumber = (val: string) => /^\d+$/.test(val)
