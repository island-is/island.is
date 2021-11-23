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
import { ProducerService } from './producer.service'
import {
  NewDocumentMessage,
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

// Validates the message POST parameter. The top-level message object has a
// `type` attribute that defines how the rest of the object is validated.
// class-validator doesn't seem to support that and this is the best solution
// I could find.
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
@ApiExtraModels(NewDocumentMessage)
export class NotificationsController {
  constructor(private readonly producer: ProducerService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(NewDocumentMessage) }],
    },
  })
  @HttpCode(201)
  async createNotification(@Req() req: Request): Promise<{ id: string }> {
    const message = await validateMessage(req.body)
    const id = await this.producer.addToQueue(message)
    return { id }
  }
}
