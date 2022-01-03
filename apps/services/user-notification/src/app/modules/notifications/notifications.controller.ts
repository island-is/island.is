import {
  Controller,
  Post,
  BadRequestException,
  Req,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiTags,
} from '@nestjs/swagger'
import { validate, ValidationError } from 'class-validator'
import { Request } from 'express'
import {
  NewDocumentMessage,
  Message,
  TypeValidator,
  ValidatorTypeMap,
} from './dto/createNotification.dto'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateNotificationResponse } from './dto/createNotification.response'
import { createEnhancedFetch } from '@island.is/clients/middlewares'


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
  constructor(@InjectQueue('notifications') private queue: QueueService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(NewDocumentMessage) }],
    },
  })
  @ApiOkResponse({ type: CreateNotificationResponse })
  @HttpCode(201)
  async createNotification(
    @Req() req: Request,
  ): Promise<CreateNotificationResponse> {
    const message = await validateMessage(req.body)
    const id = await this.queue.add(message)
    return { id }
  }

  @Get("rabbz")
  async asdf(
  ): Promise<any> {
    console.log(process.env.NOTIFICATIONS_CLIENT_ID,process.env.NOTIFICATIONS_CLIENT_SECRET)
    
    // some kennitala 
    const url = "http://localhost:3366/userProfile/0101302989/device-tokens"


    // THIS IS WHAT NEEDS TO WORK
    const enhancedFetch = createEnhancedFetch({
      name: 'my-fetch',
      autoAuth: {
        issuer: 'https://identity-server.dev01.devland.is',
        clientId: process.env.NOTIFICATIONS_CLIENT_ID ?? '',
        clientSecret: process.env.NOTIFICATIONS_CLIENT_SECRET ?? '',
        scope: ['@island.is/user-profile:admin'],
        mode: 'auto',
      },
    })
    
    // Gets an access token and adds as authorization header.
    console.log("FETCHING URL ... =  ", url)
    try {
      const response = await enhancedFetch(url)
      return response.json()
    } catch (error) {
      return error
    }
  }
}