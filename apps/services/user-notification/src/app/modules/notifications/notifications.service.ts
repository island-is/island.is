import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import { paginate } from '@island.is/nest/pagination'
import type { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

import { Notification } from './notification.model'
import axios from 'axios'
import { ArgumentDto } from './dto/createHnippNotification.dto'
import { HnippTemplate } from './dto/hnippTemplate.response'
import {
  PaginatedNotificationDto,
  UpdateNotificationDto,
  RenderedNotificationDto,
  ExtendedPaginationDto,
  UnseenNotificationsCountDto,
  UnreadNotificationsCountDto,
} from './dto/notification.dto'

const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const CONTENTFUL_GQL_ENDPOINT =
  'https://graphql.contentful.com/content/v1/spaces/8k0h54kbe6bj/environments/master'

/**
 * These are the properties that can be replaced in the template
 */
const ALLOWED_REPLACE_PROPS: Array<keyof HnippTemplate> = [
  'notificationTitle',
  'notificationBody',
  'notificationDataCopy',
  'clickAction',
  'clickActionWeb',
]

/**
 * Finds {{key}} in string
 */
const ARG_REPLACE_REGEX = new RegExp(/{{[^{}]*}}/)

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async performGraphQLRequest(query: string) {
    try {
      const response = await axios.post(
        CONTENTFUL_GQL_ENDPOINT,
        { query },
        {
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(error.response.data);
      } else {
        this.logger.error('GraphQL Request Failed', { error });
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // async getOrganizationTitle(senderId: string, locale: string): Promise<string> {

  //   // return if cache has valid response
  //   const cacheKey = `org-${senderId}-${locale}`
  //   const cachedOrganization = await this.getFromCache(cacheKey)
  //   if (cachedOrganization) {
  //     this.logger.info(`cache hit for: ${cacheKey}`)
  //     return cachedOrganization as string
  //   }
    
  //   const mappedLocale = this.mapLocale(locale)
  //   const contentfulOrganizationQuery = {
  //     query: `{
  //       organizationCollection(where: {kennitala: "${senderId}"},locale: "${mappedLocale}") {
  //         items {
  //           title
  //           kennitala
  //         }
  //       }
  //     }`,
  //   }

  //   const res = await axios
  //     .post(CONTENTFUL_GQL_ENDPOINT, contentfulOrganizationQuery, {
  //       headers: {
  //         'content-type': 'application/json',
  //         authorization: `Bearer ${ACCESS_TOKEN}`,
  //       },
  //     })
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         throw new BadRequestException(error.response.data)
  //       } else {
  //         throw new BadRequestException('Bad Request')
  //       }
  //     })
  //   // console.log("resss",res.data.organizationCollection.items[0])
  //   return res.data.organizationCollection.items[0].title
  // }
  async getOrganizationTitle(senderId: string, locale: string): Promise<string> {
    const mappedLocale = this.mapLocale(locale);
    const cacheKey = `org-${senderId}-${mappedLocale}`;
    let cachedOrganization = await this.cacheManager.get<string>(cacheKey)
    if (cachedOrganization) {
      this.logger.info(`Cache hit for: ${cacheKey}`); // needddded ?
      return cachedOrganization;
    }

    const contentfulOrganizationQuery = `{
      organizationCollection(where: {kennitala: "${senderId}"}, locale: "${mappedLocale}") {
        items {
          title
        }
      }
    }`;

    const res = await this.performGraphQLRequest(contentfulOrganizationQuery);
    const organizationTitle = res.data.organizationCollection.items[0]?.title;

    if (!organizationTitle) {
      throw new NotFoundException(`Organization title not found for ID: ${senderId}`);
    }

    await this.cacheManager.set(cacheKey, organizationTitle) //this.addToCache(cacheKey, organizationTitle);
    return organizationTitle;
  }

  private async formatAndMapNotification(
    notification: Notification,
    templateId: string,
    locale: string,
    template?: HnippTemplate,
  ): Promise<RenderedNotificationDto> {
    try {
      // If template is not provided, fetch it
      if (!template) {
        template = await this.getTemplate(templateId, locale)
      }

      // dis is de spot
      const organizationArg = notification.args.find(
        (arg) => arg.key === 'organization',
      )
      // if senderId is set and args contains organization, fetch organizationtitle from senderId
      if (notification.senderId && organizationArg) {
        try {
            // const organizationTitle = 'Bobby can fly'
            const organizationTitle = await this.getOrganizationTitle(
              notification.senderId,
              locale
            )
            if (organizationTitle) {
              console.log("found a org title",organizationTitle)
              organizationArg.value = organizationTitle

            } else {
              this.logger.warn('title not found for ...........', {senderId:notification.senderId,locale:locale})
            }
            // organizationArg.value = organizationTitle
           
          
        } catch (error) {
          this.logger.error('error...........', {senderId:notification.senderId,locale:locale})

        }
        
      }

      // Format the template with arguments from the notification
      const formattedTemplate = this.formatArguments(
        notification.args,
        template,
      )

      // Map to RenderedNotificationDto
      return {
        id: notification.id,
        messageId: notification.messageId,
        senderId: notification.senderId || '', // ................... or null
        title: formattedTemplate.notificationTitle,
        body: formattedTemplate.notificationBody,
        dataCopy: formattedTemplate.notificationDataCopy,
        clickAction: formattedTemplate.clickAction,
        created: notification.created,
        updated: notification.updated,
        read: notification.read,
        seen: notification.seen,
      }
    } catch (error) {
      this.logger.error('Error formatting notification:', error)
      throw new InternalServerErrorException('Error processing notification')
    }
  }

  // async addToCache(key: string, item: object) {
  //   return await this.cacheManager.set(key, item)
  // }

  // async getFromCache(key: string) {
  //   return await this.cacheManager.get(key)
  // }

  mapLocale(locale?: string | null | undefined): string {
    return locale === 'en' ? locale : 'is-IS'
  }

  // async getTemplates(
  //   locale?: string | null | undefined,
  // ): Promise<HnippTemplate[]> {
  //   const mappedLocale = this.mapLocale(locale)

  //   this.logger.info(
  //     'Fetching templates from Contentful GQL for locale: ' + mappedLocale,
  //   )

  //   const contentfulHnippTemplatesQuery = {
  //     query: `{
  //     hnippTemplateCollection(locale: "${mappedLocale}") {
  //       items {
  //         templateId
  //         notificationTitle
  //         notificationBody
  //         notificationDataCopy
  //         clickAction
  //         clickActionWeb
  //         category
  //         args
  //       }
  //     }
  //   }`,
  //   }

  //   const res = await axios
  //     .post(CONTENTFUL_GQL_ENDPOINT, contentfulHnippTemplatesQuery, {
  //       headers: {
  //         'content-type': 'application/json',
  //         authorization: `Bearer ${ACCESS_TOKEN}`,
  //       },
  //     })
  //     .then((response) => {
  //       for (const item of response.data.data.hnippTemplateCollection.items) {
  //         // contentful returns null for empty arrays
  //         if (item.args == null) item.args = []
  //       }
  //       return response.data
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         throw new BadRequestException(error.response.data)
  //       } else {
  //         throw new BadRequestException('Bad Request')
  //       }
  //     })
  //   return res.data.hnippTemplateCollection.items
  // }

  async getTemplates(locale?: string | null | undefined): Promise<HnippTemplate[]> {
    const mappedLocale = this.mapLocale(locale);
    const cacheKey = `templates-${mappedLocale}`;
    
    // Try to retrieve the templates from cache first
    let cachedTemplates = await this.cacheManager.get<HnippTemplate[]>(cacheKey);
    if (cachedTemplates) {
      this.logger.info(`Cache hit for templates: ${cacheKey}`);
      return cachedTemplates;
    }
  
    // GraphQL query to fetch all templates for the specified locale
    const contentfulTemplatesQuery = `{
      hnippTemplateCollection(locale: "${mappedLocale}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          clickActionWeb
          category
          args
        }
      }
    }`;
  
    try {
      const res = await this.performGraphQLRequest(contentfulTemplatesQuery);
      const templates = res.data.hnippTemplateCollection.items;
  
      if (templates.length === 0) {
        this.logger.warn(`No templates found for locale: ${mappedLocale}`);
        return [];
      }
  
      // Cache the fetched templates before returning
      await this.cacheManager.set(cacheKey, templates);
      return templates;
    } catch (error) {
      this.logger.error('Error fetching templates:', { locale, error });
      throw error; // Rethrow the caught error
    }
  }
  

  // async getTemplate(
  //   templateId: string,
  //   locale?: string | null | undefined,
  // ): Promise<HnippTemplate> {
  //   locale = this.mapLocale(locale)
  //   //check cache
  //   const cacheKey = `${templateId}-${locale}`
  //   const cachedTemplate = await this.cacheManager.get<HnippTemplate>(cacheKey)

  //   if (cachedTemplate) {
  //     this.logger.info(`cache hit for: ${cacheKey}`)

  //     return cachedTemplate as HnippTemplate
  //   }

  //   try {
  //     for (const template of await this.getTemplates(locale)) {
  //       if (template.templateId == templateId) {
  //         await this.addToCache(cacheKey, template)
  //         return template
  //       }
  //     }

  //     throw new NotFoundException(`Template: ${templateId} not found`)
  //   } catch {
  //     throw new NotFoundException(`Template: ${templateId} not found`)
  //   }
  // }

  async getTemplate(templateId: string, locale?: string | null | undefined): Promise<HnippTemplate> {
    const mappedLocale = this.mapLocale(locale);
    const cacheKey = `template-${templateId}-${mappedLocale}`;
    
    // Try to retrieve the template from cache first
    let cachedTemplate = await this.cacheManager.get<HnippTemplate>(cacheKey);
    if (cachedTemplate) {
      this.logger.info(`Cache hit for template: ${cacheKey}`);
      return cachedTemplate;
    }
  
    // Query to fetch a specific template by templateId
    const contentfulTemplateQuery = `{
      hnippTemplateCollection(where: {templateId: "${templateId}"}, locale: "${mappedLocale}") {
        items {
          templateId
          notificationTitle
          notificationBody
          notificationDataCopy
          clickAction
          clickActionWeb
          category
          args
        }
      }
    }`;
  
    try {
      const res = await this.performGraphQLRequest(contentfulTemplateQuery);
      const template = res.data.hnippTemplateCollection.items.length > 0 ? res.data.hnippTemplateCollection.items[0] : null;
      
      if (!template) {
        throw new NotFoundException(`Template not found for ID: ${templateId}`);
      }
  
      // Cache the fetched template before returning
      await this.cacheManager.set(cacheKey, template);
      return template;
    } catch (error) {
      this.logger.error('Error fetching template:', { templateId, error });
      throw error; // Rethrow the caught error
    }
  }

  /**
   * Checks if the arguments provided in the request body are valid for the template and checks if the number of arguments match
   */
  async validate(templateId: string, args: ArgumentDto[]) {
    const template = await this.getTemplate(templateId)

    if (!this.validateArgCounts(args, template)) {
      throw new BadRequestException(
        `Number of arguments doesn't match, template requires ${template.args.length} arguments but ${args.length} were provided`,
      )
    }

    const validArgs = this.validateArgs(args, template)

    if (!validArgs.isValid && validArgs.message) {
      throw new BadRequestException(validArgs.message)
    }
  }

  validateArgCounts(args: ArgumentDto[], template: HnippTemplate): boolean {
    return args.length == template.args.length
  }

  /**
   * Checks if the arguments provided in the request body are valid for the template
   */
  validateArgs(args: ArgumentDto[], template: HnippTemplate) {
    for (const arg of args) {
      if (!template.args.includes(arg.key)) {
        return {
          isValid: false,
          message: `${arg.key} is not a valid argument for template: ${template.templateId}`,
        }
      }
    }

    return {
      isValid: true,
    }
  }

  formatArguments(args: ArgumentDto[], template: HnippTemplate): HnippTemplate {
    if (args.length > 0) {
      Object.keys(template).forEach((key) => {
        const templateKey = key as keyof HnippTemplate

        if (
          ALLOWED_REPLACE_PROPS.includes(templateKey) &&
          templateKey !== 'args'
        ) {
          const value = template[templateKey] as string

          if (value && ARG_REPLACE_REGEX.test(value)) {
            for (const arg of args) {
              const regexTarget = new RegExp(`{{${arg.key}}}`, 'g')
              const newValue = value.replace(regexTarget, arg.value)
              if (newValue !== value) {
                // finds {{key}} in string and replace with value
                template[templateKey] = value.replace(regexTarget, arg.value)
                break
              }
            }
          }
        }
      })
    }

    return template
  }

  async findOne(
    user: User,
    id: number,
    locale: string,
  ): Promise<RenderedNotificationDto> {
    const notification = await this.notificationModel.findOne({
      where: { id: id, recipient: user.nationalId },
    })

    if (!notification) {
      throw new NoContentException()
    }

    return this.formatAndMapNotification(
      notification,
      notification.templateId,
      locale,
    )
  }

  async findMany(
    user: User,
    query: ExtendedPaginationDto,
  ): Promise<PaginatedNotificationDto> {
    const templates = await this.getTemplates(query.locale)
    const paginatedListResponse = await paginate({
      Model: this.notificationModel,
      limit: query.limit || 10,
      after: query.after || '',
      before: query.before,
      primaryKeyField: 'id',
      orderOption: [['id', 'DESC']],
      where: { recipient: user.nationalId },
    })

    const formattedNotifications = await Promise.all(
      paginatedListResponse.data.map(async (notification) => {
        const template = templates.find(
          (t) => t.templateId === notification.templateId,
        )

        if (template) {
          return this.formatAndMapNotification(
            notification,
            notification.templateId,
            query.locale,
            template,
          )
        } else {
          this.logger.warn(
            'Template not found for notification: ' + notification.id,
          )
          return null
        }
      }),
    )
    paginatedListResponse.data = formattedNotifications.filter((n) => n) // Filter out nulls if any
    return paginatedListResponse
  }

  async update(
    user: User,
    id: number,
    updateNotificationDto: UpdateNotificationDto,
    locale: string,
  ): Promise<RenderedNotificationDto> {
    const [numberOfAffectedRows, [updatedNotification]] =
      await this.notificationModel.update(updateNotificationDto, {
        where: {
          id: id,
          recipient: user.nationalId,
        },
        returning: true,
      })

    if (numberOfAffectedRows === 0) {
      throw new NoContentException()
    } else {
      return this.formatAndMapNotification(
        updatedNotification,
        updatedNotification.templateId,
        locale,
      )
    }
  }

  async getUnreadNotificationsCount(
    user: User,
  ): Promise<UnreadNotificationsCountDto> {
    try {
      const unreadCount = await this.notificationModel.count({
        where: {
          recipient: user.nationalId,
          read: false,
        },
      })
      return { unreadCount }
    } catch (error) {
      this.logger.error('Error getting unread notifications count:', error)
      throw new InternalServerErrorException(
        'Error getting unread notifications count',
      )
    }
  }

  async getUnseenNotificationsCount(
    user: User,
  ): Promise<UnseenNotificationsCountDto> {
    try {
      const unseenCount = await this.notificationModel.count({
        where: {
          recipient: user.nationalId,
          seen: false,
        },
      })
      return { unseenCount }
    } catch (error) {
      this.logger.error('Error getting unseen notifications count:', error)
      throw new InternalServerErrorException(
        'Error getting unseen notifications count',
      )
    }
  }

  async markAllAsSeen(user: User): Promise<void> {
    try {
      await this.notificationModel.update(
        { seen: true },
        { where: { recipient: user.nationalId, seen: false } },
      )
    } catch (error) {
      this.logger.error('Error marking all notifications as seen:', error)
      throw new InternalServerErrorException(
        'Error marking all notifications as seen',
      )
    }
  }
}
