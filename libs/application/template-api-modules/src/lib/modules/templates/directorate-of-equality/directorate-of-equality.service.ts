import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  type CompanyDto,
  type ParsedCriterionDto,
  type ParsedEmployeeDto,
  type ParsedReportDto,
  type ParsedRoleDto,
  type ParsedSubCriterionDto,
} from '@island.is/clients/directorate-of-equality'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  Gender,
  type ApplicationAnswers,
} from '@island.is/application/templates/directorate-of-equality/equality-report'
import type { ApplicationAnswers as SalaryReportAnswers } from '@island.is/application/templates/directorate-of-equality/salary-report'
import { FetchError } from '@island.is/clients/middlewares'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

// The evaluation model scores each sub-criterion out of `weight × 10` — a fixed
// 1000-point total scale (the sub-criterion weights sum to 100). Mirrors the
// frontend's JobClassificationEditor/utils.ts so submitted scores match what
// the applicant saw on screen.
const POINTS_PER_WEIGHT_PERCENT = 10

const LOGGING_CONTEXT = 'DirectorateOfEqualityService'

@Injectable()
export class DirectorateOfEqualityService extends BaseTemplateApiService {
  constructor(
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super('DirectorateOfEquality')
  }

  private extractFetchErrorDetails(error: unknown): {
    status?: number
    statusText?: string
    problem?: unknown
    message?: string
  } {
    if (error instanceof FetchError) {
      return {
        status: error.status,
        statusText: error.statusText,
        problem: error.problem,
      }
    }
    return {
      message: error instanceof Error ? error.message : String(error),
    }
  }

  private mapSubCriterionToParsed(sc: {
    title: string
    description?: string
    weight: string
    stepCount: string
    steps: { description: string }[]
  }): ParsedSubCriterionDto {
    const count = sc.steps?.length || Number(sc.stepCount) || 0
    const weight = Number(sc.weight) || 0
    const maxScore = weight * POINTS_PER_WEIGHT_PERCENT
    const perStep = count > 0 ? maxScore / count : 0
    return {
      title: sc.title,
      description: sc.description ?? '',
      weight,
      steps: Array.from({ length: count }, (_, i) => ({
        order: i + 1,
        description: sc.steps?.[i]?.description ?? '',
        score: (i + 1) * perStep,
      })),
    }
  }

  private mapAnswersToParsedReport(
    answers: SalaryReportAnswers,
  ): ParsedReportDto {
    const jobFactors = answers.criteria?.jobFactors ?? []
    const personalFactors = answers.criteria?.personalFactors ?? []
    const subCriteriaJobFactors = answers.subCriteria?.jobFactors ?? []
    const subCriteriaPersonalFactors =
      answers.subCriteria?.personalFactors ?? []

    const criteria: ParsedCriterionDto[] = [
      ...jobFactors.map((factor, i) => ({
        type: factor.type as ParsedCriterionDto['type'],
        title: factor.title,
        description: factor.description,
        weight: Number(factor.weight) || 0,
        subCriteria: (subCriteriaJobFactors[i] ?? []).map((sc) =>
          this.mapSubCriterionToParsed(sc),
        ),
      })),
      ...personalFactors.map((factor, i) => ({
        type: 'PERSONAL' as const,
        title: factor.title,
        description: factor.description ?? '',
        weight: Number(factor.weight) || 0,
        subCriteria: (subCriteriaPersonalFactors[i] ?? []).map((sc) =>
          this.mapSubCriterionToParsed(sc),
        ),
      })),
    ]

    const roles: ParsedRoleDto[] = (answers.roles ?? []).map((role) => ({
      title: role.title,
      stepAssignments: role.stepAssignments.map((a) => ({
        criterionTitle: a.criterionTitle,
        subTitle: a.subTitle,
        stepOrder: a.stepOrder,
      })),
    }))

    const employees: ParsedEmployeeDto[] = (answers.employees ?? []).map(
      (e) => ({
        ordinal: e.ordinal,
        identifier: e.identifier,
        roleTitle: e.roleTitle,
        education: e.education as ParsedEmployeeDto['education'],
        gender: e.gender as ParsedEmployeeDto['gender'],
        field: e.field,
        department: e.department,
        startDate: e.startDate,
        workRatio: e.workRatio,
        baseSalary: e.baseSalary,
        additionalFixedOvertime: e.additionalFixedOvertime,
        additionalFixedCarAllowance: e.additionalFixedCarAllowance,
        bonusOccasionalCarAllowance: e.bonusOccasionalCarAllowance,
        bonusOccasionalOvertime: e.bonusOccasionalOvertime,
        bonusPayments: e.bonusPayments,
        bonusOther: e.bonusOther,
        personalStepAssignments: e.personalStepAssignments.map((a) => ({
          criterionTitle: a.criterionTitle,
          subTitle: a.subTitle,
          stepOrder: a.stepOrder,
        })),
      }),
    )

    return { criteria, roles, employees }
  }

  async getCompanyData({ auth }: TemplateApiModuleActionProps) {
    const company = await this.companyRegistryService.getCompany(
      auth.nationalId,
    )

    if (!company) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        404,
      )
    }

    return company
  }

  async getDoeCompany({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getCompany(auth)
    } catch (error) {
      this.logger.error('Failed to get company data from DOE, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { employeeCountCategory: 'UNKNOWN' }
    }
  }

  async getActiveEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const report =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch (error) {
      this.logger.error('Failed to get active equality report, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { hasActiveEqualityReport: false }
    }
  }

  async getEqualityReportTemplateHtml({ auth }: TemplateApiModuleActionProps) {
    return this.directorateOfEqualityService.getEqualityReportTemplateHtml(auth)
  }

  async getEqualityReportTemplateDocx({ auth }: TemplateApiModuleActionProps) {
    const blob =
      await this.directorateOfEqualityService.getEqualityReportTemplateDocx(
        auth,
      )
    const arrayBuffer = await blob.arrayBuffer()
    return { base64: Buffer.from(arrayBuffer).toString('base64') }
  }

  async getPreviousEqualityReportContent({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const hasActiveReport = getValueViaPath<boolean>(
      application.externalData,
      'activeEqualityReport.data.hasActiveEqualityReport',
    )
    if (!hasActiveReport) return null

    // `identifier` is set to the submitting application's id at submit time
    // (see submitEqualityReport below), the same value stored as `providerId`
    // — which is what getReport() looks up by.
    const providerId = getValueViaPath<string>(
      application.externalData,
      'activeEqualityReport.data.identifier',
    )
    if (!providerId) return null
    try {
      // TODO: PROVIDER ID VS COMPANY ID.
      const report = await this.directorateOfEqualityService.getReport(
        auth,
        providerId,
      )
      return { equalityReportContent: report.equalityReportContent ?? '' }
    } catch (error) {
      this.logger.error(
        'Failed to get previous equality report content, falling back',
        {
          applicationId: application.id,
          context: LOGGING_CONTEXT,
          ...this.extractFetchErrorDetails(error),
        },
      )
      return null
    }
  }

  async getBlankExcelTemplate({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const blob =
        await this.directorateOfEqualityService.getBlankExcelTemplate(auth)
      const arrayBuffer = await blob.arrayBuffer()
      return {
        base64: Buffer.from(arrayBuffer).toString('base64'),
        filename: 'launagreining-sniðmát.xlsx',
      }
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get blank Excel template', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async presignImportUpload({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.presignImportUpload(auth)
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to presign import upload', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async parseSalaryReportWorkbook({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const key = getValueViaPath<string>(
      application.externalData,
      'importPresign.data.key',
    )
    if (!key) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }
    try {
      return await this.directorateOfEqualityService.importSalaryReportWorkbook(
        auth,
        key,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to parse salary report workbook', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async analyzeSalaryReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as unknown as SalaryReportAnswers
    const parsed = this.mapAnswersToParsedReport(answers)
    try {
      return await this.directorateOfEqualityService.analyzeSalaryReport(auth, {
        parsed,
      })
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to analyze salary report', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async submitSalaryReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as unknown as SalaryReportAnswers

    const equalityReportId = getValueViaPath<string>(
      application.externalData,
      'activeEqualityReport.data.id',
    )
    if (!equalityReportId) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }

    const doeCompany = getValueViaPath<CompanyDto>(
      application.externalData,
      'doeCompany.data',
    )

    const companyAdminGenderMap: Record<string, 'MALE' | 'FEMALE' | 'NEUTRAL'> =
      {
        MALE: 'MALE',
        FEMALE: 'FEMALE',
        NON_BINARY: 'NEUTRAL',
      }

    const subsidiaryList = answers.subsidiaries?.list ?? []
    const parsed = this.mapAnswersToParsedReport(answers)
    const outliersPostponed =
      answers.salaryAnalysis?.postponed?.includes('yes') ?? false

    try {
      return await this.directorateOfEqualityService.submitSalaryReport(auth, {
        equalityReportId,
        identifier: application.id,
        importedFromExcel: Boolean(
          getValueViaPath(application.externalData, 'parsedSalaryReport.date'),
        ),
        providerId: application.id,
        companyAdminName: answers.chiefExecutive?.name ?? '',
        companyAdminEmail: answers.chiefExecutive?.email ?? '',
        companyAdminGender: answers.chiefExecutive?.gender
          ? companyAdminGenderMap[answers.chiefExecutive.gender] ?? 'NEUTRAL'
          : 'NEUTRAL',
        contactName: answers.contactPerson?.name ?? '',
        contactEmail: answers.contactPerson?.email ?? '',
        contactPhone: answers.contactPerson?.phone ?? '',
        averageEmployeeMaleCount: Number(answers.employeeCount?.men) || 0,
        averageEmployeeFemaleCount: Number(answers.employeeCount?.women) || 0,
        averageEmployeeNeutralCount:
          Number(answers.employeeCount?.nonBinary) || 0,
        parsed,
        company: {
          name: answers.generalInformation?.companyName ?? '',
          nationalId: answers.generalInformation?.nationalId ?? '',
          address: answers.generalInformation?.address ?? '',
          city: answers.generalInformation?.municipality ?? '',
          postcode: answers.generalInformation?.postalCode ?? '',
          isatCategory: answers.generalInformation?.isatClassification ?? '',
        },
        subsidiaries:
          answers.subsidiaries?.includesSubsidiaries === 'yes'
            ? subsidiaryList.map((s) => ({
                name: s.nationalIdWithName.name,
                nationalId: s.nationalIdWithName.nationalId,
              }))
            : [],
        outliersPostponed,
        outlierGroups: outliersPostponed
          ? []
          : (answers.salaryAnalysis?.outlierGroups ?? [])
              .filter((g) => g.employeeOrdinals.length > 0)
              .map((g) => ({
                name: g.name,
                reason: g.reason ?? '',
                action: g.action ?? '',
                signatureName: g.signatureName ?? '',
                signatureRole: g.signatureRole ?? '',
                employeeOrdinals: g.employeeOrdinals,
              })),
      })
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to submit salary report', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async editOutliers({ auth, application }: TemplateApiModuleActionProps) {
    const answers = application.answers as unknown as SalaryReportAnswers

    const groups = (answers.salaryAnalysis?.outlierGroups ?? [])
      .filter((g) => g.employeeOrdinals.length > 0)
      .map((g) => ({
        name: g.name,
        reason: g.reason ?? '',
        action: g.action ?? '',
        signatureName: g.signatureName ?? '',
        signatureRole: g.signatureRole ?? '',
        employeeOrdinals: g.employeeOrdinals,
      }))

    try {
      await this.directorateOfEqualityService.editOutliers(
        auth,
        application.id,
        {
          groups,
        },
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to edit outliers', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async submitEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as ApplicationAnswers

    const genderMap: Record<Gender, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
      [Gender.MALE]: 'MALE',
      [Gender.FEMALE]: 'FEMALE',
      [Gender.NON_BINARY]: 'NEUTRAL',
    }
    const equalityReportContent = getValueViaPath(
      answers,
      'goalsAndActions.customField',
      '',
    )

    const subsidiaryList = answers.subsidiaries?.list ?? []

    try {
      return await this.directorateOfEqualityService.submitEqualityReport(
        auth,
        {
          identifier: application.id,
          providerId: application.id,
          companyAdminName: answers.chiefExecutive?.name ?? '',
          companyAdminEmail: answers.chiefExecutive?.email ?? '',
          companyAdminGender: answers.chiefExecutive?.gender
            ? genderMap[answers.chiefExecutive.gender]
            : 'NEUTRAL',
          contactName: answers.contactPerson?.name ?? '',
          contactEmail: answers.contactPerson?.email ?? '',
          contactPhone: answers.contactPerson?.phone ?? '',
          equalityReportContent: equalityReportContent ?? '',
          company: {
            name: answers.generalInformation?.companyName ?? '',
            nationalId: answers.generalInformation?.nationalId ?? '',
            address: answers.generalInformation?.address ?? '',
            city: answers.generalInformation?.municipality ?? '',
            postcode: answers.generalInformation?.postalCode ?? '',
            isatCategory: answers.generalInformation?.isatClassification ?? '',
          },
          subsidiaries:
            answers.subsidiaries?.includesSubsidiaries === 'yes'
              ? subsidiaryList.map((s) => ({
                  name: s.nationalIdWithName.name,
                  nationalId: s.nationalIdWithName.nationalId,
                }))
              : [],
        },
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to submit equality report', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })

      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }
}
