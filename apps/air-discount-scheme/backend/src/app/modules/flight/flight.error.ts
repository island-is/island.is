import { HttpException, HttpStatus } from '@nestjs/common'

export class FlightLimitExceeded extends HttpException {
  constructor() {
    super(
      'Forbidden, flight legs exceed the amount of quota the user has left',
      HttpStatus.FORBIDDEN,
    )
  }
}
