import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { UserService } from '../user'
import { NotificationService } from './notification.service'

@Controller('api/case/:id')
@ApiTags('cases')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
