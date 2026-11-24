import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import kennitala from 'kennitala'

import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CreateApiKeyDto,
  DirectorateOfEqualityClientService,
  ReportEmployeeOutlierDto,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'
import { FetchError, handle404 } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DownloadServiceConfig } from '@island.is/nest/config'

import { DetailInput } from './dto/detail.input'
import { GrantServiceProviderInput } from './dto/grantServiceProvider.input'
import { IssueApiKeyInput } from './dto/issueApiKey.input'
import { RevokeApiKeyInput } from './dto/revokeApiKey.input'
import { RevokeServiceProviderInput } from './dto/revokeServiceProvider.input'
import { SubmissionsInput } from './dto/submissions.input'
import {
  mapApiKey,
  mapAvailableServiceProviders,
  mapCompany,
  mapEqualityPlan,
  mapImprovementPlan,
  mapReport,
  mapServiceProvider,
  mapSubmission,
} from './mapper'
import { ApiKeys } from './models/apiKeys.model'
import { AvailableServiceProviders } from './models/availableServiceProviders.model'
import { Company } from './models/company.model'
import {
  DirectorateOfEqualityApiKeyType,
  DirectorateOfEqualitySubmissionType,
} from './models/enums'
import { EqualityPlan } from './models/equalityPlan.model'
import { ImprovementAction } from './models/improvementAction.model'
import { IssuedApiKey } from './models/issuedApiKey.model'
import { MutationResult } from './models/mutationResult.model'
import { ReportWithContext } from './models/report.model'
import { ServiceProviders } from './models/serviceProviders.model'
import { Submission } from './models/submission.model'
import { Submissions } from './models/submissions.model'

const OUTLIERS_PAGE_SIZE = 100
const MAX_OUTLIER_PAGES = 50

const isSubmission = (submission?: Submission): submission is Submission =>
  !!submission

const SUBMISSION_SCOPES: Record<DirectorateOfEqualitySubmissionType, ApiScope> =
  {
    [DirectorateOfEqualitySubmissionType.EQUALITY_PLAN]:
      ApiScope.directorateOfEquality,
    [DirectorateOfEqualitySubmissionType.SALARY_REPORT]:
      ApiScope.directorateOfEqualitySalary,
  }

const COMPANY_KEY_SCOPES: NonNullable<CreateApiKeyDto['scopes']> = [
  'salary:submit',
  'equality:submit',
  'report:read',
  'scoring:write',
]

@Injectable()
export class DirectorateOfEqualityService {
  constructor(
    private readonly directorateOfEqualityClientService: DirectorateOfEqualityClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  private assertCompany(user: User) {
    if (!kennitala.isCompany(user.nationalId)) {
      throw new ForbiddenException()
    }
  }

  private assertSubmissionScope(
    user: User,
    type: DirectorateOfEqualitySubmissionType,
  ) {
    if (!user.scope.includes(SUBMISSION_SCOPES[type])) {
      throw new ForbiddenException()
    }
  }

  private getReportDetail(user: User, id: string) {
    return this.directorateOfEqualityClientService
      .getReport(user, id)
      .catch(handle404)
  }

  async getSubmissions(
    user: User,
    input: SubmissionsInput,
  ): Promise<Submissions> {
    this.assertCompany(user)
    this.assertSubmissionScope(user, input.type)
    const response = await this.directorateOfEqualityClientService.getReports(
      user,
    )
    return {
      items: (response?.reports ?? [])
        .map(mapSubmission)
        .filter(isSubmission)
        .filter((submission) => submission.type === input.type),
    }
  }

  async getEqualityPlan(
    user: User,
    input: DetailInput,
  ): Promise<EqualityPlan | null> {
    this.assertCompany(user)
    this.assertSubmissionScope(
      user,
      DirectorateOfEqualitySubmissionType.EQUALITY_PLAN,
    )
    const report = await this.getReportDetail(user, input.id)
    return report?.type === ReportTypeEnum.EQUALITY
      ? mapEqualityPlan(input.id, report, this.downloadServiceConfig.baseUrl)
      : null
  }

  async getReport(
    user: User,
    input: DetailInput,
  ): Promise<ReportWithContext | null> {
    this.assertCompany(user)
    this.assertSubmissionScope(
      user,
      DirectorateOfEqualitySubmissionType.SALARY_REPORT,
    )
    const report = await this.getReportDetail(user, input.id)
    return report?.type === ReportTypeEnum.SALARY
      ? mapReport(input.id, report, this.downloadServiceConfig.baseUrl)
      : null
  }

  async getImprovementPlan(
    user: User,
    providerId: string,
  ): Promise<ImprovementAction[]> {
    const outliers: ReportEmployeeOutlierDto[] = []
    let page = 1
    let hasNextPage = true
    while (hasNextPage && page <= MAX_OUTLIER_PAGES) {
      const response =
        await this.directorateOfEqualityClientService.getReportOutliers(
          user,
          providerId,
          page,
          OUTLIERS_PAGE_SIZE,
        )
      outliers.push(...response.outliers)
      hasNextPage = response.paging.hasNextPage
      page += 1
    }
    if (hasNextPage) {
      this.logger.warn('Stopped paging report outliers at the page limit', {
        reportId: providerId,
        maxPages: MAX_OUTLIER_PAGES,
      })
    }
    return mapImprovementPlan(outliers)
  }

  async getCompany(user: User): Promise<Company> {
    this.assertCompany(user)
    const company = await this.directorateOfEqualityClientService.getCompany(
      user,
    )
    const partnerClient = company.isServiceProvider
      ? await this.directorateOfEqualityClientService.getPartnerClient(user)
      : undefined
    return mapCompany(company, partnerClient?.createdAt ?? undefined)
  }

  async getApiKeys(user: User): Promise<ApiKeys> {
    this.assertCompany(user)
    const [{ apiKeys }, company] = await Promise.all([
      this.directorateOfEqualityClientService.getApiKeys(user),
      this.directorateOfEqualityClientService.getCompany(user),
    ])
    const providerKeys = company.isServiceProvider
      ? (
          await this.directorateOfEqualityClientService.getPartnerClientKeys(
            user,
          )
        ).keys
      : []
    return {
      items: [
        ...apiKeys.map((apiKey) =>
          mapApiKey(apiKey, DirectorateOfEqualityApiKeyType.COMPANY),
        ),
        ...providerKeys.map((apiKey) =>
          mapApiKey(apiKey, DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER),
        ),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    }
  }

  async issueApiKey(
    user: User,
    input: IssueApiKeyInput,
  ): Promise<IssuedApiKey> {
    this.assertCompany(user)
    const body = {
      label: input.label ?? null,
      expiresAt: input.expiresAt ?? null,
    }
    const issued =
      input.type === DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER
        ? await this.directorateOfEqualityClientService.issuePartnerClientKey(
            user,
            body,
          )
        : await this.directorateOfEqualityClientService.issueApiKey(user, {
            ...body,
            scopes: COMPANY_KEY_SCOPES,
          })
    return { id: issued.id, key: issued.key }
  }

  async revokeApiKey(
    user: User,
    input: RevokeApiKeyInput,
  ): Promise<MutationResult> {
    this.assertCompany(user)
    if (input.type === DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER) {
      await this.directorateOfEqualityClientService.revokePartnerClientKey(
        user,
        input.id,
      )
    } else {
      await this.directorateOfEqualityClientService.revokeApiKey(user, input.id)
    }
    return { success: true }
  }

  async getServiceProviders(user: User): Promise<ServiceProviders> {
    this.assertCompany(user)
    const { delegations } =
      await this.directorateOfEqualityClientService.getPartnerDelegations(user)
    return { items: delegations.map(mapServiceProvider) }
  }

  async getAvailableServiceProviders(
    user: User,
  ): Promise<AvailableServiceProviders> {
    this.assertCompany(user)
    const [{ providers }, { delegations }] = await Promise.all([
      this.directorateOfEqualityClientService.getPartnerProviders(user),
      this.directorateOfEqualityClientService.getPartnerDelegations(user),
    ])
    return { items: mapAvailableServiceProviders(providers, delegations) }
  }

  async grantServiceProvider(
    user: User,
    input: GrantServiceProviderInput,
  ): Promise<MutationResult> {
    this.assertCompany(user)
    try {
      await this.directorateOfEqualityClientService.grantPartnerDelegation(
        user,
        { partnerClientId: input.id },
      )
    } catch (error) {
      if (!(error instanceof FetchError && error.status === 409)) {
        throw error
      }
    }
    return { success: true }
  }

  async revokeServiceProvider(
    user: User,
    input: RevokeServiceProviderInput,
  ): Promise<MutationResult> {
    this.assertCompany(user)
    await this.directorateOfEqualityClientService.revokePartnerDelegation(
      user,
      input.id,
    )
    return { success: true }
  }
}
