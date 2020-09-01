import { HttpException, HttpStatus } from '@nestjs/common'

export class DiscountCodeInvalid extends HttpException {
  constructor() {
    super('Bad Request, discount code is invalid', HttpStatus.BAD_REQUEST)
  }
}
