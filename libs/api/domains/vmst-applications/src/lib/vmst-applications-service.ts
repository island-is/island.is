import { User } from '@island.is/auth-nest-tools'
import { BadGatewayException, Inject, Injectable } from '@nestjs/common'
import {
  VmstUnemploymentClientService,
  GaldurXRoadAPIModelsApplicantApplicantOverviewResponse,
  GaldurExternalDomainModelsAttachmentAttachmentRequestDTO,
  GaldurExternalDomainModelsAttachmentAttachmentDTO,
  GaldurXRoadAPIModelsAvailableActions,
  GaldurDomainModelsSettingsAttachmentTypesAttachmentTypeListViewModel,
  GaldurExternalDomainModelsIncomeIncomesDTO,
  GaldurExternalDomainModelsIncomeIncomesResponse,
} from '@island.is/clients/vmst-unemployment'
import { FetchError } from '@island.is/clients/middlewares'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import { VmstApplicationsVacationValidationInput } from './dto/vacationValidation.input'
import { VmstApplicationsIncomeValidationInput } from './dto/incomeValidation.input'
import { VmstApplicationsU2ValidationInput } from './dto/u2Validation.input'
import {
  VmstApplicationsUnemploymentApplicationOverview,
  VmstApplicationsActivationGrantApplicationOverview,
  VmstApplicationsValidationUnemploymentApplication,
  VmstApplicationsApplicantAttachment,
  VmstApplicationsApplicantAttachmentsResponse,
  VmstApplicationsOverview,
  VmstApplicationsIncomeValidationResult,
  VmstApplicationsU2ValidationResponse,
  VmstApplicantIncomes,
} from './models'
import type { Locale } from '@island.is/shared/types'
import { maskString } from '@island.is/shared/utils'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@nestjs/config'

@Injectable()
export class VMSTApplicationsService {
  constructor(
    private readonly vmstUnemploymentService: VmstUnemploymentClientService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  async validateBankInformation(
    auth: User,
    input: VmstApplicationsBankInformationInput,
  ): Promise<boolean> {
    const payload = {
      galdurApplicationApplicationsB2BQueriesValidateBankInformationQuery: {
        applicantSSN: auth.nationalId,
        ...input,
      },
    }

    return this.vmstUnemploymentService.validateBankInfo(payload)
  }

  async validateBankInformationUnemploymentApplication(
    auth: User,
    input: VmstApplicationsBankInformationInput,
  ): Promise<VmstApplicationsValidationUnemploymentApplication> {
    const payload = {
      galdurApplicationApplicationsUnemploymentApplicationsCommandsValidateUnemploymentApplicationPaymentPageValidateUnemploymentApplicationPaymentPageCommand:
        {
          ssn: auth.nationalId,
          bankingPensionUnion: {
            bankId: input.bankNumber,
            ledgerId: input.ledger,
            accountNumber: input.accountNumber,
            pensionFund: {
              id: input.pensionFund?.id || '',
              percentage: input.pensionFund?.percentage,
            },
            doNotPayToUnion: input.doNotPayToUnion,
            union: {
              id: input.union?.id || '',
            },
            supplementaryPensionFunds:
              input.privatePensionFunds?.map((fund) => ({
                id: fund.id,
                percentage: fund.percentage,
              })) || [],
          },
        },
    }
    const response =
      await this.vmstUnemploymentService.validateBankInfoUnemploymentApplication(
        payload,
      )
    return { ...response, isValid: response.isValid ?? false }
  }

  async validateVacationDays(
    auth: User,
    input: VmstApplicationsVacationValidationInput,
  ): Promise<VmstApplicationsValidationUnemploymentApplication> {
    const payload = {
      galdurApplicationApplicationsUnemploymentApplicationsCommandsValidateUnemploymentApplicationUnpaidVacationValidateUnemploymentApplicationUnpaidVacationCommand:
        {
          ssn: auth.nationalId,
          employerSettlement: {
            hasUnpaidVacationTime: input.hasUnpaidVacationTime,
            unpaidVacations: input.unpaidVacations?.map((x) => {
              return {
                unpaidVacationDays: x.unpaidVacationDays,
                unpaidVacationStart: x.unpaidVacationStart,
                unpaidVacationEnd: x.unpaidVacationEnd,
              }
            }),
            resignationEnds: input.resignationEnds,
          },
        },
    }

    const response =
      await this.vmstUnemploymentService.validateVacationInfoUnemploymentApplication(
        payload,
      )
    return { ...response, isValid: response.isValid ?? false }
  }

  // Generic income validation entrypoint; accepts any subset of the five income
  // arrays served by the same Galdur endpoint. Service branches per item on
  // `deleted` to emit either a delete marker or a create-shape payload.
  async validateIncomes(
    auth: User,
    input: VmstApplicationsIncomeValidationInput,
  ): Promise<VmstApplicationsIncomeValidationResult> {
    const { applicantId } = await this.resolveApplicant(auth)
    const request = {
      applicantId,
      galdurExternalDomainRequestsIncomeCreateIncomesRequest: {
        irregularJobs: input.irregularJobs?.map((job) =>
          job.deleted
            ? { id: job.id, deleted: true, employerSSN: job.employerSSN }
            : {
                referenceId: job.validationId,
                employerSSN: job.employerSSN,
                periodFrom: job.periodFrom
                  ? new Date(job.periodFrom)
                  : undefined,
                periodTo: job.periodTo ? new Date(job.periodTo) : undefined,
                estimatedIncome: job.estimatedIncome,
                workShiftPeriodIds: job.workShiftPeriodIds,
              },
        ),
        contractorJobs: input.contractorJobs?.map((job) =>
          job.deleted
            ? { id: job.id, deleted: true }
            : {
                referenceId: job.validationId,
                periodFrom: job.periodFrom
                  ? new Date(job.periodFrom)
                  : undefined,
                periodTo: job.periodTo ? new Date(job.periodTo) : undefined,
              },
        ),
        capitalIncomePayments: input.capitalIncomePayments?.map((payment) =>
          payment.deleted
            ? { id: payment.id, deleted: true }
            : {
                referenceId: payment.validationId,
                incomeTypeId: payment.incomeTypeId,
                estimatedIncome: payment.estimatedIncome,
                periodFrom: payment.periodFrom
                  ? new Date(payment.periodFrom)
                  : undefined,
                periodTo: payment.periodTo ? new Date(payment.periodTo) : null,
              },
        ),
        trPayments: input.trPayments?.map((payment) =>
          payment.deleted
            ? { id: payment.id, deleted: true }
            : {
                referenceId: payment.validationId,
                incomeTypeId: payment.incomeTypeId,
                estimatedIncome: payment.estimatedIncome,
                periodFrom: payment.periodFrom
                  ? new Date(payment.periodFrom)
                  : undefined,
                periodTo: payment.periodTo ? new Date(payment.periodTo) : null,
              },
        ),
        pensionPayments: input.pensionPayments?.map((payment) =>
          payment.deleted
            ? { id: payment.id, deleted: true }
            : {
                referenceId: payment.validationId,
                incomeTypeId: payment.incomeTypeId,
                pensionFundId: payment.pensionFundId,
                estimatedIncome: payment.estimatedIncome,
                periodFrom: payment.periodFrom
                  ? new Date(payment.periodFrom)
                  : undefined,
                periodTo: payment.periodTo ? new Date(payment.periodTo) : null,
              },
        ),
        partTimeJobs: input.partTimeJobs?.map((job) =>
          job.deleted
            ? { id: job.id, deleted: true, employerSSN: job.employerSSN }
            : {
                referenceId: job.validationId,
                employerSSN: job.employerSSN,
                periodFrom: job.periodFrom
                  ? new Date(job.periodFrom)
                  : undefined,
                periodTo: job.periodTo ? new Date(job.periodTo) : undefined,
                ratio: job.ratio,
                estimatedIncome: job.estimatedIncome,
              },
        ),
      },
    }

    try {
      const response = await this.vmstUnemploymentService.validatIncome(request)
      return this.buildIncomeValidationResult(response)
    } catch (e) {
      if (e instanceof FetchError && e.status === 400 && e.body) {
        return this.buildIncomeValidationResult(
          e.body as GaldurExternalDomainModelsIncomeIncomesResponse,
        )
      }
      throw e
    }
  }

  private buildIncomeValidationResult(
    response: GaldurExternalDomainModelsIncomeIncomesResponse,
  ): VmstApplicationsIncomeValidationResult {
    const isValid = response.success ?? false
    const errors = (response.errors ?? []).flatMap((error) =>
      error.referenceId
        ? [
            {
              validationId: error.referenceId,
              reason: error.reason,
              reasonEN: error.reasonEN,
            },
          ]
        : [],
    )

    return {
      isValid,
      invalidValidationIds: errors.map((error) => error.validationId),
      errors,
    }
  }

  async validateU2(
    auth: User,
    input: VmstApplicationsU2ValidationInput,
  ): Promise<VmstApplicationsU2ValidationResponse> {
    const response = await this.vmstUnemploymentService.validateU2(
      auth,
      new Date(input.dateWhenLeaving),
      input.destinationCountryId,
    )
    return {
      isValid: response.isValid ?? false,
      reason: response.reason,
      reasonEN: response.reasonEN,
    }
  }

  async getApplicationOverview(
    auth: User,
    locale?: Locale,
  ): Promise<VmstApplicationsUnemploymentApplicationOverview> {
    return this.vmstUnemploymentService.getApplicationOverview(auth, locale)
  }

  async getActivationGrantApplicationOverview(
    auth: User,
    locale?: Locale,
  ): Promise<VmstApplicationsActivationGrantApplicationOverview> {
    return this.vmstUnemploymentService.getActivationGrantApplicationOverview(
      auth,
      locale,
    )
  }

  async resolveApplicant(auth: User): Promise<{ applicantId: string }> {
    return await this.vmstUnemploymentService.resolveApplicant(auth)
  }

  async getApplicationsOverview(
    applicantId: string,
  ): Promise<VmstApplicationsOverview> {
    const result = await this.vmstUnemploymentService.getApplicationsOverview(
      applicantId,
    )
    return {
      unemploymentApplication: result.unemploymentApplication ?? undefined,
      activationGrant: result.activationGrant ?? undefined,
    }
  }

  async getApplicationsOverviewForUser(
    auth: User,
  ): Promise<VmstApplicationsOverview> {
    try {
      const { applicantId } = await this.resolveApplicant(auth)
      return this.getApplicationsOverview(applicantId)
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        return {
          unemploymentApplication: { isVisible: false },
          activationGrant: { isVisible: false },
        }
      }
      throw e
    }
  }

  async getApplicantOverview(
    applicantId: string,
    locale?: Locale,
  ): Promise<GaldurXRoadAPIModelsApplicantApplicantOverviewResponse> {
    return this.vmstUnemploymentService.getApplicantOverview(
      applicantId,
      locale,
    )
  }

  async getApplicantRequestedAttachments(
    applicantId: string,
  ): Promise<Array<GaldurExternalDomainModelsAttachmentAttachmentRequestDTO>> {
    return this.vmstUnemploymentService.getApplicantRequestedAttachments(
      applicantId,
    )
  }

  async getApplicantActions(
    applicantId: string,
  ): Promise<GaldurXRoadAPIModelsAvailableActions> {
    return this.vmstUnemploymentService.getApplicantActions(applicantId)
  }

  async getApplicantIncomes(auth: User): Promise<VmstApplicantIncomes> {
    try {
      const { applicantId } = await this.resolveApplicant(auth)
      const dto: GaldurExternalDomainModelsIncomeIncomesDTO =
        await this.vmstUnemploymentService.getApplicantIncomes(applicantId)

      const incomeCollectionKeys = [
        'irregularJobs',
        'partTimeJobs',
        'pensionPayments',
        'capitalIncomePayments',
        'trPayments',
        'contractorJobs',
      ] as const

      const invalidKeys = incomeCollectionKeys.filter(
        (key) => !Array.isArray(dto[key]),
      )
      if (invalidKeys.length > 0) {
        throw new BadGatewayException(
          `VMST applicant incomes response has invalid shape for: ${invalidKeys.join(
            ', ',
          )}`,
        )
      }

      return {
        irregularJobs: dto.irregularJobs,
        partTimeJobs: dto.partTimeJobs,
        pensionPayments: dto.pensionPayments,
        capitalIncomePayments: dto.capitalIncomePayments,
        trPayments: dto.trPayments,
        contractorJobs: dto.contractorJobs,
      } as VmstApplicantIncomes
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        return {
          irregularJobs: [],
          partTimeJobs: [],
          pensionPayments: [],
          capitalIncomePayments: [],
          trPayments: [],
          contractorJobs: [],
        }
      }
      throw e
    }
  }

  async getApplicantAttachments(
    applicantId: string,
    nationalId: string,
  ): Promise<VmstApplicationsApplicantAttachmentsResponse> {
    const response = await this.vmstUnemploymentService.getApplicantAttachments(
      applicantId,
    )

    const mapItems = async (
      items: Array<{
        id?: string
        typeId?: string | null
        name?: string
        contentType?: string
        created?: string
      }>,
    ): Promise<VmstApplicationsApplicantAttachment[]> => {
      return Promise.all(
        items.flatMap((item) => {
          if (!item.id || !item.name || !item.contentType || !item.created) {
            return []
          }

          const { id, typeId, name, contentType, created } = item

          return [
            maskString(id, nationalId).then((maskedId) => ({
              id,
              typeId: typeId ?? null,
              name,
              contentType,
              created,
              downloadServiceUrl: maskedId
                ? `${this.downloadServiceConfig.baseUrl}/download/v1/vmst/attachment/${maskedId}`
                : null,
            })),
          ]
        }),
      )
    }

    const [userSubmitted, letters] = await Promise.all([
      mapItems(response.userSubmitted ?? []),
      mapItems(response.letters ?? []),
    ])

    return { userSubmitted, letters }
  }

  async getAttachmentTypes(): Promise<GaldurDomainModelsSettingsAttachmentTypesAttachmentTypeListViewModel> {
    return this.vmstUnemploymentService.getAttachmentTypes()
  }

  async getAttachment(
    attachmentId: string,
  ): Promise<GaldurExternalDomainModelsAttachmentAttachmentDTO> {
    return this.vmstUnemploymentService.getAttachment(attachmentId)
  }
}
