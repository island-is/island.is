import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationTypes,
  Application as BaseApplication,
} from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { IntlService } from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'
import { getCurrentUser } from '@island.is/auth-nest-tools'

import {
  Application,
  ApplicationPaginatedResponse,
  ApplicationsStatistics,
} from '@island.is/application/api/core'
import { getCurrentLocale } from '../utils/currentLocale'
import {
  HistoryService,
  History,
  HistoryBuilder,
} from '@island.is/application/api/history'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { PaymentService } from '@island.is/application/api/payment'
import {
  getAdminDataForAdminPortal,
  getApplicantName,
  getApplicationGenericNameTranslationString,
  getApplicationNameTranslationString,
  getApplicationStatisticsNameTranslationString,
  getPaymentStatusForAdmin,
  tryToGetNameFromNationalId,
} from '../utils/application'
import {
  ApplicationListAdminResponseDto,
  ApplicationTypeAdminInstitution,
} from '../dto/applicationAdmin.response.dto'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

@Injectable()
export class ApplicationAdminSerializer
  implements NestInterceptor<Application, Promise<unknown>>
{
  constructor(
    private intlService: IntlService,
    private historyService: HistoryService,
    private historyBuilder: HistoryBuilder,
    private featureFlagService: FeatureFlagService,
    private paymentService: PaymentService,
    private nationalRegistryApi: NationalRegistryClientService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<unknown>> {
    const user = getCurrentUser(context)
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(
        async (
          res: Application | Array<Application> | ApplicationPaginatedResponse,
        ) => {
          const isArray = Array.isArray(res)

          const showHistory = await this.featureFlagService.getValue(
            Features.applicationSystemHistory,
            false,
            user,
          )
          if (isArray) {
            const applications = res as Application[]
            return this.serializeArray(
              applications,
              showHistory,
              user.nationalId,
              locale,
            )
          }
          if ((res as ApplicationPaginatedResponse).rows) {
            const data = res as ApplicationPaginatedResponse
            const applications = data.rows as Application[]

            data.rows = (await this.serializeArray(
              applications,
              showHistory,
              user.nationalId,
              locale,
            )) as Application[]
            return data
          }

          return this.serialize(res as Application, user.nationalId, locale)
        },
      ),
    )
  }

  async serialize(
    model: Application,
    nationalId: string,
    locale: Locale,
    historyModel: History[] = [],
    showHistory = true,
  ) {
    const application = model.toJSON() as BaseApplication
    const template = await getApplicationTemplateByTypeId(
      application.typeId as ApplicationTypes,
    )
    const helper = new ApplicationTemplateHelper(application, template)
    const actionCardMeta = helper.getApplicationActionCardMeta()
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)

    const userRole = template.mapUserToRole(nationalId, application) ?? ''

    const roleInState = helper.getRoleInState(userRole)

    const applicantActors = await Promise.all(
      application.applicantActors.map((actorNationalId) =>
        tryToGetNameFromNationalId(actorNationalId, this.nationalRegistryApi),
      ),
    )
    const actors =
      application.applicant === nationalId ? application.applicantActors : []

    const pendingAction = showHistory
      ? helper.getCurrentStatePendingAction(
          application,
          userRole,
          intl.formatMessage,
          nationalId,
        )
      : undefined

    const history = showHistory
      ? await this.historyBuilder.buildApplicationHistory(
          historyModel,
          intl.formatMessage,
          helper,
        )
      : undefined

    const payment = await this.paymentService.findPaymentByApplicationId(
      application.id,
    )

    let applicantName: string | undefined | null
    try {
      const applicant = await this.nationalRegistryApi.getIndividual(
        application.applicant,
      )
      applicantName = applicant?.fullName
    } catch (e) {
      applicantName = getApplicantName(application)
    }

    const dto = plainToInstance(ApplicationListAdminResponseDto, {
      ...application,
      ...helper.getReadableAnswersAndExternalData(userRole),
      applicantActors,
      applicationActors: actors,
      actionCard: {
        title: actionCardMeta.title
          ? intl.formatMessage(actionCardMeta.title)
          : null,
        description: actionCardMeta.description
          ? intl.formatMessage(actionCardMeta.description)
          : null,
        tag: {
          variant: actionCardMeta.tag.variant || null,
          label: actionCardMeta.tag.label
            ? intl.formatMessage(actionCardMeta.tag.label)
            : null,
        },
        deleteButton: roleInState?.delete,
        pendingAction,
        history,
        draftFinishedSteps: application.draftFinishedSteps,
        draftTotalSteps: application.draftTotalSteps,
      },
      name: getApplicationNameTranslationString(
        template,
        application,
        intl.formatMessage,
      ),
      institution: template.institution
        ? intl.formatMessage(template.institution)
        : null,
      progress: helper.getApplicationProgress(),
      answers: [],
      externalData: [],
      paymentStatus: getPaymentStatusForAdmin(payment),
      applicantName: applicantName,
      adminData: await getAdminDataForAdminPortal(
        template,
        application,
        intl.formatMessage,
        this.nationalRegistryApi,
      ),
    })
    return instanceToPlain(dto)
  }

  async serializeArray(
    applications: Application[],
    showHistory: boolean,
    nationalId: string,
    locale: Locale,
  ) {
    let histories: History[] = []
    if (showHistory) {
      histories = await this.historyService.getStateHistory(
        applications.map((item) => item.id),
      )
    }

    return Promise.all(
      applications.map((item) =>
        this.serialize(
          item,
          nationalId,
          locale,
          histories.filter((x) => x.application_id === item.id),
          showHistory,
        ),
      ),
    )
  }
}

@Injectable()
export class ApplicationTypeAdminSerializer
  implements NestInterceptor<ApplicationTypeAdminInstitution, Promise<unknown>>
{
  constructor(private intlService: IntlService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ApplicationTypeAdminInstitution>,
  ): Observable<Promise<unknown>> {
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(
        async (
          res:
            | ApplicationTypeAdminInstitution
            | Array<ApplicationTypeAdminInstitution>,
        ) => {
          const isArray = Array.isArray(res)

          if (isArray) {
            const applicationTypes =
              res as Array<ApplicationTypeAdminInstitution>
            return this.serializeArray(applicationTypes, locale)
          } else {
            return this.serialize(
              res as ApplicationTypeAdminInstitution,
              locale,
            )
          }
        },
      ),
    )
  }

  async serialize(type: ApplicationTypeAdminInstitution, locale: Locale) {
    const template = await getApplicationTemplateByTypeId(
      type.id as ApplicationTypes,
    )
    const namespaces = [
      'application.system',
      ...(template?.translationNamespaces ?? []),
    ]
    const intl = await this.intlService.useIntl(namespaces, locale)
    const name = template
      ? getApplicationGenericNameTranslationString(template, intl.formatMessage)
      : ''

    return instanceToPlain({ id: type.id, name: name ?? '' })
  }

  async serializeArray(
    applicationTypes: ApplicationTypeAdminInstitution[],
    locale: Locale,
  ) {
    return Promise.all(
      applicationTypes.map((item) => this.serialize(item, locale)),
    )
  }
}

@Injectable()
export class ApplicationAdminStatisticsSerializer
  implements NestInterceptor<ApplicationsStatistics, Promise<unknown>>
{
  constructor(private intlService: IntlService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ApplicationsStatistics>,
  ): Observable<Promise<unknown>> {
    const locale = getCurrentLocale(context)

    return next.handle().pipe(
      map(
        async (res: ApplicationsStatistics | Array<ApplicationsStatistics>) => {
          const isArray = Array.isArray(res)

          if (isArray) {
            const applications = res as Array<ApplicationsStatistics>
            return this.serializeArray(applications, locale)
          }
        },
      ),
    )
  }

  async serialize(model: ApplicationsStatistics, locale: Locale) {
    const template = await getApplicationTemplateByTypeId(
      model.typeid as ApplicationTypes,
    )
    const namespaces = [
      'application.system',
      ...(template?.translationNamespaces ?? []),
    ]
    const intl = await this.intlService.useIntl(namespaces, locale)
    const name = getApplicationStatisticsNameTranslationString(
      template,
      model,
      intl.formatMessage,
    )

    const dto = plainToInstance(ApplicationListAdminResponseDto, {
      ...model,
      name: name ?? '',
    })

    return instanceToPlain(dto)
  }

  async serializeArray(applications: ApplicationsStatistics[], locale: Locale) {
    return (
      await Promise.allSettled(
        applications.map((item) => this.serialize(item, locale)),
      )
    )
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item): item is PromiseFulfilledResult<Record<string, any>> =>
          item.status === 'fulfilled',
      )
      .map((item) => item.value)
  }
}
