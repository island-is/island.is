import { HttpException, HttpStatus } from '@nestjs/common'

export class DiscountLimitExceeded extends HttpException {
  constructor() {
    super('Forbidden, user has no discount quota left', HttpStatus.FORBIDDEN)
  }
}

export class DiscountCodeInvalid extends HttpException {
  constructor() {
    super('Bad Request, discount code is invalid', HttpStatus.BAD_REQUEST)
  }
}
