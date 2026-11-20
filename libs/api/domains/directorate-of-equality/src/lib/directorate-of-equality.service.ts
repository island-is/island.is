import { ForbiddenException, Injectable } from '@nestjs/common'
import kennitala from 'kennitala'

import type { User } from '@island.is/auth-nest-tools'
import {
  CreateApiKeyDto,
  DirectorateOfEqualityClientService,
  ReportEmployeeOutlierDto,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'

import { IssueApiKeyInput, RevokeApiKeyInput } from './dto/apiKey.input'
import { DetailInput } from './dto/detail.input'
import {
  GrantServiceProviderInput,
  RevokeServiceProviderInput,
} from './dto/serviceProvider.input'
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
import { ApiKeys, IssuedApiKey } from './models/apiKey.model'
import { Company } from './models/company.model'
import { DirectorateOfEqualityApiKeyType } from './models/enums'
import { EqualityPlan } from './models/equalityPlan.model'
import { ImprovementAction } from './models/improvementAction.model'
import { MutationResult } from './models/mutationResult.model'
import { Pdf } from './models/pdf.model'
import { ReportWithContext } from './models/report.model'
import {
  AvailableServiceProviders,
  ServiceProviders,
} from './models/serviceProvider.model'
import { Submissions } from './models/submissions.model'

const OUTLIERS_PAGE_SIZE = 100

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
  ) {}

  private assertCompany(user: User) {
    if (!kennitala.isCompany(user.nationalId)) {
      throw new ForbiddenException()
    }
  }

  async getSubmissions(
    user: User,
    input: SubmissionsInput,
  ): Promise<Submissions> {
    this.assertCompany(user)
    const { reports } =
      await this.directorateOfEqualityClientService.getReports(user)
    return {
      items: reports
        .map(mapSubmission)
        .filter((submission) => submission.type === input.type),
    }
  }

  async getEqualityPlan(
    user: User,
    input: DetailInput,
  ): Promise<EqualityPlan | null> {
    this.assertCompany(user)
    const report = await this.directorateOfEqualityClientService.getReport(
      user,
      input.id,
    )
    return report.type === ReportTypeEnum.EQUALITY
      ? mapEqualityPlan(input.id, report)
      : null
  }

  async getEqualityPlanPdf(user: User, input: DetailInput): Promise<Pdf> {
    this.assertCompany(user)
    const file =
      await this.directorateOfEqualityClientService.getEqualityContentPdf(
        user,
        input.id,
      )
    return {
      content: Buffer.from(await file.arrayBuffer()).toString('base64'),
    }
  }

  async getReport(
    user: User,
    input: DetailInput,
  ): Promise<ReportWithContext | null> {
    this.assertCompany(user)
    const report = await this.directorateOfEqualityClientService.getReport(
      user,
      input.id,
    )
    return report.type === ReportTypeEnum.SALARY
      ? mapReport(input.id, report)
      : null
  }

  async getImprovementPlan(
    user: User,
    providerId: string,
  ): Promise<ImprovementAction[]> {
    const outliers: ReportEmployeeOutlierDto[] = []
    let page = 1
    let hasNextPage = true
    while (hasNextPage) {
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
    return mapImprovementPlan(outliers)
  }

  async getCompany(user: User): Promise<Company> {
    this.assertCompany(user)
    const company = await this.directorateOfEqualityClientService.getCompany(
      user,
    )
    const partnerClient = company.isServiceProvider
      ? await this.directorateOfEqualityClientService.getPartnerClient(user)
      : null
    return mapCompany(company, partnerClient?.createdAt ?? null)
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
    await this.directorateOfEqualityClientService.grantPartnerDelegation(user, {
      partnerClientId: input.id,
    })
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
