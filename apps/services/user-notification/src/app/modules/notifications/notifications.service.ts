import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { Cache } from 'cache-manager'
import axios from 'axios'
import { Notification } from './notification.model'
import { InjectModel } from '@nestjs/sequelize'

import { paginate } from '@island.is/nest/pagination'


// 

import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Op } from 'sequelize'
import { NotificationDTO, NotificationStatus } from './dto/notification.dto'
import { User } from '@island.is/auth-nest-tools'



const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const contentfulGqlUrl =
  'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master'


  
@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async addToCache(key: string, item: object) {
    return await this.cacheManager.set(key, item)
  }

  async getFromCache(key: string) {
    return await this.cacheManager.get(key)
  }

  async mapLocale(locale: string | null | undefined): Promise<string> {
    if (locale === 'en') {
      return 'en'
    }
    return 'is-IS'
  }
  async getTemplates(
    locale?: string | null | undefined,
  ): Promise<HnippTemplate[]> {
    locale = await this.mapLocale(locale)

    this.logger.info(
      'Fetching templates from Contentful GQL for locale: ' + locale,
    )

    const contentfulHnippTemplatesQuery = {
      query: ` {
      hnippTemplateCollection(locale: "${locale}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          category
          args
        }
      }
    }
    `,
    }

    const res = await axios
      .post(contentfulGqlUrl, contentfulHnippTemplatesQuery, {
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + accessToken,
        },
      })
      .then((response) => {
        for (const item of response.data.data.hnippTemplateCollection.items) {
          // contentful returns null for empty arrays
          if (item.args == null) item.args = []
        }
        return response.data
      })
      .catch((error) => {
        if (error.response) {
          throw new BadRequestException(error.response.data)
        } else {
          throw new BadRequestException('Bad Request')
        }
      })
    return res.data.hnippTemplateCollection.items
  }

  async getTemplate(
    templateId: string,
    locale?: string | null | undefined,
  ): Promise<HnippTemplate> {
    locale = await this.mapLocale(locale)
    //check cache
    const cacheKey = templateId + '-' + locale
    const cachedTemplate = await this.getFromCache(cacheKey)
    if (cachedTemplate) {
      this.logger.info('cache hit for: ' + cacheKey)
      return cachedTemplate as HnippTemplate
    }

    try {
      for (const template of await this.getTemplates(locale)) {
        if (template.templateId == templateId) {
          await this.addToCache(cacheKey, template)
          return template
        }
      }
      throw new NotFoundException(`Template: ${templateId} not found`)
    } catch {
      throw new NotFoundException(`Template: ${templateId} not found`)
    }
  }

  validateArgCounts(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): boolean {
    return body.args.length == template.args.length
  }

  formatArguments(
    body: CreateHnippNotificationDto,
    template: HnippTemplate,
  ): HnippTemplate {
    if (template.args.length > 0) {
      const allowedReplaceProperties = [
        'notificationTitle',
        'notificationBody',
        'notificationDataCopy',
        'clickAction',
      ]
      // find {{arg.key}} in string and replace with arg.value
      const regex = new RegExp(/{{[^{}]*}}/)
      Object.keys(template).forEach((key) => {
        if (allowedReplaceProperties.includes(key)) {
          let value = template[key as keyof HnippTemplate] as string
          if (value) {
            if (regex.test(value)) {
              for (const arg of body.args) {
                const regexTarget = new RegExp('{{' + arg.key + '}}', 'g')
                value = value.replace(regexTarget, arg.value)
                template[key as keyof Omit<HnippTemplate, 'args'>] = value
              }
            }
          }
        }
      })
    }
    return template
  }

  async findOne(user: User,id: number): Promise<any> {
    return await this.notificationModel.findOne({
      where: {
        id: id,
        recipient: user.nationalId
      }
    });
  }

  async findMany(user:User,query: any): Promise<any> {
    return await paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      // where: { ListId: listId }, // insert sequelize where clause
    })
  }

  // async findAll(user: User, cursor?: string, limit = 10): Promise<any> {
  //   return this.notificationModel.paginate({
  //     where: {
  //       recipient: user.nationalId
  //     },
  //     order: [['id', 'DESC']],
  //     limit: limit,
  //     after: cursor,
  //   }).then((result) => {
  //     console.log(result);
  //   });
  //   return await this.notificationModel.findAll({
  //     where: cursor ? {  recipient: user.nationalId, id: { [Op.gt]: cursor } } : {}, // AND nationalId
  //     limit: limit,
  //   });
    
  // }


  // async update(user: User,id: number, updateNotificationDto: UpdateNotificationDto): Promise<any> {
  //   const notification = await this.notificationModel.findOne({
  //     where: {
  //       id: id,
  //       recipient: user.nationalId // Check if the recipient matches the nationalId
  //     }
  //   });
  
  //   if (!notification) {
  //     throw new NotFoundException('Notification not found or does not belong to the user');
  //   }
  
  //   // Update the notification with the provided DTO
  //   return await notification.update(updateNotificationDto);
   
  // }

  

  // Just a test function WHILE DEVELOPING
  async create(user:User, notificationData: NotificationDTO): Promise<any> {
    const exampleNotificationData = {
      recipient: user.nationalId,
      templateId: "HNIPP.POSTHOLF.NEW_DOCUMENT",
      args: [
        {
          key: "organization",
          value: "Hnipp Test Crew"
        },
        {
          key: "documentId",
          value: "abcd-abcd-abcd-abcd"
        }
      ],
      status: NotificationStatus.UNREAD
    };
    return this.notificationModel.create(exampleNotificationData as any);
  }

  
}
