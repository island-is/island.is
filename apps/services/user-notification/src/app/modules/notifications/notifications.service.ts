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
// import notificationModel from './notification.model'
import { Notification } from './notification.model'
import { InjectModel } from '@nestjs/sequelize'


// 

import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { Op } from 'sequelize'
import { NotificationDTO } from './dto/notification.dto'

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

  async findOne(nationalId: string,id: number): Promise<any> {
    return await this.notificationModel.findByPk(id);
   
  }

  async findAll(nationalId: string, cursor?: number, limit = 10): Promise<any[]> {
    return await this.notificationModel.findAll({
      where: cursor ? { cursor: { [Op.gt]: cursor } } : {}, // AND nationalId
      limit: limit,
    });
    
  }

  async update(nationalId: string,id: number, updateNotificationDto: UpdateNotificationDto): Promise<any> {
    return await this.notificationModel.findByPk(id);
   
  }

  async create(nationalId:string, notificationData: NotificationDTO): Promise<Notification> {
    const exampleNotificationData = {
      // Assuming 'cursor' is a required field. 
      // Its value can be set dynamically as needed
      // cursor: Math.floor(Math.random() * 100000), // Example dynamic value
      recipient: nationalId,
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
      status: "unread"
    };
    return this.notificationModel.create(exampleNotificationData as any);
  }

  
}
