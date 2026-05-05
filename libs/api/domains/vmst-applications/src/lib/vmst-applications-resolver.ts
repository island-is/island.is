import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { VMSTApplicationsService } from './vmst-applications-service'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import {
  ValidationUnemploymentApplication,
  VmstApplicationsUnemploymentApplicationOverview,
  VmstApplicationsOverview,
  VmstApplicantOverview,
  VmstApplicantRequestedAttachment,
  VmstAvailableActions,
  VmstAttachmentTypeList,
} from './models'
import { VmstApplicationsVacationValidationInput } from './dto/vacationValidation.input'
import type { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/vmst-applications' })
export class VMSTApplicationsResolver {
  constructor(
    private readonly vmstApplicationsService: VMSTApplicationsService,
  ) {}

  @Query(() => Boolean, {
    name: 'vmstApplicationsAccountNumberValidation',
  })
  @Audit()
  async validateBankInformation(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsBankInformationInput,
    })
    input: VmstApplicationsBankInformationInput,
  ) {
    return this.vmstApplicationsService.validateBankInformation(auth, input)
  }

  @Query(() => ValidationUnemploymentApplication, {
    name: 'vmstApplicationsAccountNumberValidationUnemploymentApplication',
  })
  @Audit()
  async validateBankInformationUnemploymentApplication(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsBankInformationInput,
    })
    input: VmstApplicationsBankInformationInput,
  ) {
    return this.vmstApplicationsService.validateBankInformationUnemploymentApplication(
      auth,
      input,
    )
  }

  @Query(() => ValidationUnemploymentApplication, {
    name: 'vmstApplicationsVacationValidationUnemploymentApplication',
  })
  @Audit()
  async validateVacationDays(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsVacationValidationInput,
    })
    input: VmstApplicationsVacationValidationInput,
  ) {
    return this.vmstApplicationsService.validateVacationDays(auth, input)
  }

  @Query(() => VmstApplicationsUnemploymentApplicationOverview, {
    name: 'vmstApplicationsUnemploymentApplicationOverview',
  })
  @Audit()
  async getApplicationOverview(
    @CurrentUser() auth: User,
    @Args('locale', { type: () => String, nullable: true })
    locale?: Locale,
  ): Promise<VmstApplicationsUnemploymentApplicationOverview | undefined> {
    return this.vmstApplicationsService.getApplicationOverview(auth, locale)
  }

  @Query(() => VmstApplicationsOverview, {
    name: 'vmstApplicationsOverview',
  })
  @Audit()
  async getApplicationsOverview(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    if (!applicantId) {
      throw new Error('Could not resolve applicant')
    }

    return this.vmstApplicationsService.getApplicationsOverview(applicantId)
  }

  @Query(() => VmstApplicantOverview, {
    name: 'vmstApplicantOverview',
  })
  @Audit()
  async getApplicantOverview(
    @CurrentUser() auth: User,
    @Args('locale', { type: () => String, nullable: true })
    locale?: Locale,
  ) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    if (!applicantId) {
      throw new Error('Could not resolve applicant')
    }

    return this.vmstApplicationsService.getApplicantOverview(
      applicantId,
      locale,
    )
  }

  @Query(() => [VmstApplicantRequestedAttachment], {
    name: 'vmstApplicantRequestedAttachments',
  })
  @Audit()
  async getApplicantRequestedAttachments(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    if (!applicantId) {
      throw new Error('Could not resolve applicant')
    }

    return this.vmstApplicationsService.getApplicantRequestedAttachments(
      applicantId,
    )
  }

  @Query(() => VmstAvailableActions, {
    name: 'vmstApplicantAvailableActions',
  })
  @Audit()
  async getApplicantAvailableActions(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    if (!applicantId) {
      throw new Error('Could not resolve applicant')
    }

    return this.vmstApplicationsService.getApplicantActions(applicantId)
  }

  @Query(() => VmstAttachmentTypeList, {
    name: 'vmstAttachmentTypes',
  })
  @Audit()
  async getAttachmentTypes() {
    return this.vmstApplicationsService.getAttachmentTypes()
  }
}
