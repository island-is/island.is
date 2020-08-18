import { ForbiddenException } from '@nestjs/common'

export class DiscountLimitExceeded extends ForbiddenException {}
