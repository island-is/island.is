import {
  Controller,
  Post,
  BadRequestException,
  Req,
  HttpCode,
} from '@nestjs/common'
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger'
import { validate, ValidationError } from 'class-validator'
import { Request } from 'express'
import { NotificationProducerService } from './producer.service'
import {
  NewPostholfMessage,
  Message,
  TypeValidator,
  ValidatorTypeMap,
} from './dto/createNotification.dto'

const throwIfError = (errors: ValidationError[]): void => {
  if (errors.length > 0) {
    throw new BadRequestException(
      errors.reduce(
        (acc, e) => acc.concat(Object.values(e.constraints ?? {})),
        [] as string[],
      ),
    )
  }
}

const validateMessage = async (body: Request['body']): Promise<Message> => {
  const type = new TypeValidator()
  Object.assign(type, body)
  throwIfError(await validate(type, { forbidUnknownValues: false }))

  const ValidatorClass = ValidatorTypeMap[type.type]
  const message = new ValidatorClass()
  Object.assign(message, body)
  throwIfError(await validate(message, { forbidUnknownValues: true }))

  return message
}

@Controller('notifications')
@ApiExtraModels(NewPostholfMessage)
export class NotificationsController {
  constructor(
    private readonly notificationProducer: NotificationProducerService,
  ) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(NewPostholfMessage) }],
    },
  })
  @HttpCode(202)
  async createNotification(@Req() req: Request): Promise<void> {
    const message = await validateMessage(req.body)
    await this.notificationProducer.sendNotification(message)
  }
}
