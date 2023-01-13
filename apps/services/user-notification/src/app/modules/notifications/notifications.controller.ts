import {
  Inject,
  Body,
  Get,
  BadRequestException,
  CACHE_MANAGER,
  Param,
  Query,
  CacheTTL,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common'
import { Controller, Post, HttpCode } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateNotificationDto } from './dto/createNotification.dto'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateNotificationResponse } from './dto/createNotification.response'

import { IntlService } from '@island.is/cms-translations'
import { createHnippNotificationDto } from './dto/createHnippNotification.dto'
import { Documentation } from '@island.is/nest/swagger'
import { HnippTemplate } from './dto/hnippTemplate.response'

import { Cache } from 'cache-manager'
import { NotificationsService } from './notifications.service'

import { Notification } from './types'

import { exec } from 'child_process'


import * as firebaseAdmin from 'firebase-admin'
export const FIREBASE_PROVIDER = 'FIREBASE_PROVIDER'

const RA_TOKEN = "fqDQOSSSHUJ2mbJH6lxsa2:APA91bHzIBgIx7E3QtJYL7Ab4wAGUa7BlHQZ0eHYIf2KGBKIVBr34PKSXhjF6jeXea4c_ucNiw7q_LDb1_k6e8_KMLmldgoTh47P-5W1U81Wk3Z2ri8AyvG9mBTSFmYTSI996Vz2pg6D"
const TOKENS = [
  "cnURZM9Qx06IkqgVok79mT:APA91bG7l2lz_noyzSQUhsVFKjQupUOd9seGZhmnLV2DV2oogN9-DbAfxzxfmZxhEYMsc7nTPrMEnD0bz10VK_ZR1v27Fcn4aD6MAA2dTRz_bGeBCN5CqGsinmBQ7I_Z48SKTK8ofqUE",
  "csE3oimi4UlvqnF_X8uLQ7:APA91bGunHpzGJrQgKXmE1P2g9p1sbDxBlN8rI8upWKafzJebFhJ6WffiUyEbL4sZvqsF-arv7ByKsi7Mn3S_dDot4qiJkE7P1d8LaGM0ojbF4AN9IKkjNKnXVX3E-N3-_T8Ul_n-B-v",
  "ddMeD2PfRL-_IuFBPSF_wL:APA91bH9C4jeAZ1VJ__E16Qlo30pvZ20IOaVW9WImVFogRj4NMCYf14nrmhQJo1l5cU0xELc9dJXuPfGbiYczaa_QdptTWy0-xo8Bf5AbSTyvIL9TCkL59alf9JDFwgaI97Yg-bhBe99",
  "dgoDdF0J6EzAqh17rwPd_b:APA91bGqiAkKIVnimA9eq7UiBZxoer2z4UbqCzP09uVgPanAWH1ozGDfZRuRI12MoSgWBmQrBk87Uqu3bC2DSB9dItdLwynwPIprQRccOIHO3LFhIuZTTEnS0ikqo3cTBEmvCvFvcLFQ",
  "dITr_-45l0cQlm9_5Mz22z:APA91bFvehVAHJYcsJfUTn2WTlPEWAQubrTzmvigthDKk_nNW5Jve5BM34wl5CE-CjeSGg6jOrsoJ4BGSvTpORtzQdX9ZnC8f1lZDsVeecfd45uzRZnj-mr70JCEFpFoVwbGa41P9fiz",
  "e1jKCnj-QQ-jrg8tpN654p:APA91bEbK37Na6Utt2ExGJYucd6IL6-mCM1ScG1D6AzfVDZ0fxuUK0ZvM7qQoUu0mTWbc7R294mhdizoLfp-JGU9CelBArYxgfofIXM22iIiU7L6jtoRxDF5K4ePmmKzN62PyzlsNSFE"
]
// import  { SNSClient } from '@aws-sdk/client-sns'

// move logic to service
// getEntry ... id ?
// cache Redis ? file system ? verify cache methods are ok global ok
// worker stuff
// openapi documentation
// lib for contentful graphql endpoint
// match fix legacy stuff
// cleanup


const CACHE_TTL = 60 // 1 minute
@Controller('notifications')
@ApiExtraModels(CreateNotificationDto)
export class NotificationsController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @InjectQueue('notifications') private queue: QueueService,
    // private intlService: IntlService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly notificationsService: NotificationsService,
    @Inject(FIREBASE_PROVIDER) private firebase: firebaseAdmin.app.App,

  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      oneOf: [{ $ref: getSchemaPath(CreateNotificationDto) }],
    },
  })
  @ApiOkResponse({ type: CreateNotificationResponse })
  @HttpCode(201)
  @Post()
  async createNotification(
    @Body() body: CreateNotificationDto,
  ): Promise<CreateNotificationResponse> {
    // redirecting legacy hnipp to new hnipp setup
    return this.createHnippNotification({
      recipient: body.recipient,
      templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
      args: [body.organization, body.documentId],
    })
  }

  

  @Documentation({
    description: 'Fetches all templates',
    summary: 'Fetches all templates',
    includeNoContentResponse: true,
    response: { status: 200, type: [HnippTemplate] },
    request: {
      query: {
        locale: {
          required: false,
          type: 'string',
          example: 'is-IS',
        },
      },
    },
  })
  // @CacheTTL(CACHE_TTL)
  // @UseInterceptors(CacheInterceptor)
  @Get('/templates')
  async getTemplates(
    @Query('locale') locale: string = 'is-IS',
  ): Promise<HnippTemplate[]> {
    try {
      return await this.notificationsService.getContentfulHnippTemplateEntries(locale)
    } catch {
      throw new BadRequestException('Error fetching templates')
    }
  }

  @Documentation({
    description: 'Fetches a single template',
    summary: 'Fetches a single template',
    includeNoContentResponse: true,
    response: { status: 200, type: HnippTemplate },
    request: {
      query: {
        locale: {
          required: false,
          type: 'string',
          example: 'is-IS',
        },
      },
      params: {
        templateId: {
          type: 'string',
          description: 'ID of the template',
          example: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        },
      },
    },
  })
  // @CacheTTL(CACHE_TTL)
  // @UseInterceptors(CacheInterceptor)
  @Get('/template/:templateId')
  async getTemplate(
    @Param('templateId')
    templateId: string,
    @Query('locale') locale: string = 'is-IS',
  ): Promise<HnippTemplate> {
    const templates = await this.getTemplates(locale)
    try {
      for (const template of templates) {
        if (template.templateId == templateId) {
          return template
        }
      }
      throw new BadRequestException('Requested template  not found')
    } catch {
      throw new BadRequestException('Requested template not found')
    }
  }

  // @Post('/preview-template')
  // async notificationTemplate(@Body() body: ViewTemplateDto): Promise<any> {
  //   for (const template of await this.getContentfulHnippTemplateEntries()) {
  //     // lazy get fix later
  //     if (template.templateId === body.templateId) {
  //       let placeholders: string[] = []
  //       const re = /{{[^{}]*}}/
  //       for (const [key, value] of Object.entries(template)) {
  //         if (re.test(value)) {
  //           let placeholder = value.match(re)
  //           placeholders.push(placeholder[0])
  //         }
  //       }

  //       if (body.args?.length !== placeholders.length) {
  //         throw new BadRequestException(
  //           "Number of arguments doesn't match - template requires " +
  //             placeholders.length +
  //             ' arguments but ' +
  //             body.args?.length +
  //             ' were provided',
  //         )
  //       }

  //       if (body.args?.length == placeholders.length) {
  //         // scan object for {{}} for counts
  //         if (re.test(template.notificationBody)) {
  //           console.log('######## found')
  //           let element = body.args.shift()
  //           if (element) {
  //             template.notificationBody = template.notificationBody.replace(
  //               re,
  //               element,
  //             )
  //           }
  //         }
  //         if (template.notificationDataCopy) {
  //           if (re.test(template.notificationDataCopy)) {
  //             console.log('######## found')
  //             let element = body.args.shift()
  //             if (element) {
  //               template.notificationDataCopy = template.notificationDataCopy.replace(
  //                 re,
  //                 element,
  //               )
  //             }
  //           }
  //         }
  //         if (template.clickAction) {
  //           if (re.test(template.clickAction)) {
  //             console.log('######## found')
  //             let element = body.args.shift()
  //             if (element) {
  //               template.clickAction = template.clickAction.replace(re, element)
  //             }
  //           }
  //         }
  //       }
  //       return template
  //     }
  //   }
  // }

  async formatArguments(body:createHnippNotificationDto,template:HnippTemplate):Promise<any>{
    const re = /{{[^{}]*}}/
          if (body.args?.length == template.args?.length) {
          // scan object for {{}} for counts
          if (re.test(template.notificationBody)) {
            console.log('######## found')
            let element = body.args.shift()
            if (element) {
              template.notificationBody = template.notificationBody.replace(
                re,
                element,
              )
            }
          }
          if (template.notificationDataCopy) {
            if (re.test(template.notificationDataCopy)) {
              console.log('######## found')
              let element = body.args.shift()
              if (element) {
                template.notificationDataCopy = template.notificationDataCopy.replace(
                  re,
                  element,
                )
              }
            }
          }
          if (template.clickAction) {
            if (re.test(template.clickAction)) {
              console.log('######## found')
              let element = body.args.shift()
              if (element) {
                template.clickAction = template.clickAction.replace(re, element)
              }
            }
          }
        }
        return template
    return {body,template}

  }

  async convertToNotification(
    message: createHnippNotificationDto,
  ): Promise<any> { //Notification

    // get template on selected language - map user profile locale to other
    const locale = "en" //'is-IS' // enum en
    // formatArgs
    const template = await this.getTemplate(message.templateId, locale)
    
    
    
    // formatObject  FUNCTION
    const notification = {
      messageType: "bogus", ///  phase me out .................
      title: template.notificationTitle,
      body: template.notificationBody,
      dataCopy: template.notificationDataCopy,
      category: template.category,
      appURI: template.clickAction  //`${this.appProtocol}://inbox/${message.documentId}`,
    }

    

    // FCM format
    return {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      apns: {
        payload: {
          aps: {
            category: notification.category,
          },
        },
      },
      data: {
        ...(notification.appURI && { url: notification.appURI }), // what is this doing ? tha () && part ?
      },
    }
    // also test FCM objects
    
  }

  async sendSNS(){
    // sns publish hack
    const cliCommand = "aws sns publish --target-arn arn:aws:sns:eu-west-1:013313053092:endpoint/GCM/AWS_SNS_FCM_tester/dcd707d7-ecad-3559-8365-09780d48d82e --message-structure json  --message file://aps.json"
    const res = exec(cliCommand);
    console.log(res)
    return res
  }

  async sendFCM(){
    const notification = {
      title: 'title',
      body: 'body',
      category: 'category',
      appURI: 'appURI',
    }
    const tokens = TOKENS
    const {
      responses,
      successCount,
    } = await this.firebase.messaging().sendMulticast({
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      apns: {
        payload: {
          aps: {
            category: notification.category,
          },
        },
      },
      data: {
        ...(notification.appURI && { url: notification.appURI }), // what is this doing ? tha () && part ?
      },
    })
    return {responses, successCount}

  }
  // write tests for 0,1,2,3,4 args messages
  // tjekka gamla shape með messagetype
  // tjekks fyrir öll published templates

  @Post('/create-notification')
  async createHnippNotification(
    @Body() body: createHnippNotificationDto,
  ): Promise<any> {

    // return await this.sendFCM()
    


    // check for template
    const template = await this.getTemplate(body.templateId)
    // check for args
    if (template.args?.length != body.args.length) {
      throw new BadRequestException(
        "Number of arguments doesn't match - template requires " +
          template.args?.length +
          ' arguments but ' +
          body.args?.length +
          ' were provided',
      )
    }
    this.sendSNS()
    return this.formatArguments(body,template)
    // add to queue
    return this.convertToNotification(body)
    return {body, template}
    const id = await this.queue.add(body)
    this.logger.info('Message queued ...', { messageId: id, ...body })
    return { id }
  }
}
