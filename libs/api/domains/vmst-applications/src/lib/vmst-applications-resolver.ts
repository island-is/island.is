import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { VMSTApplicationsService } from './vmst-applications-service'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import {
  VmstApplicationsValidationUnemploymentApplication,
  VmstApplicationsUnemploymentApplicationOverview,
  VmstApplicationsOverview,
  VmstApplicationsApplicantOverview,
  VmstApplicationsApplicantRequestedAttachment,
  VmstApplicationsApplicantAttachment,
  VmstApplicationsAvailableActions,
  VmstApplicationsAttachmentTypeList,
  VmstApplicationsAttachment,
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

  @Query(() => VmstApplicationsValidationUnemploymentApplication, {
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

  @Query(() => VmstApplicationsValidationUnemploymentApplication, {
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
  async getApplicationsOverview(
    @CurrentUser() auth: User,
  ): Promise<VmstApplicationsOverview> {
    return this.vmstApplicationsService.getApplicationsOverviewForUser(auth)
  }

  @Query(() => VmstApplicationsApplicantOverview, {
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

    return this.vmstApplicationsService.getApplicantOverview(
      applicantId,
      locale,
    )
  }

  @Query(() => [VmstApplicationsApplicantRequestedAttachment], {
    name: 'vmstApplicantRequestedAttachments',
  })
  @Audit()
  async getApplicantRequestedAttachments(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    return this.vmstApplicationsService.getApplicantRequestedAttachments(
      applicantId,
    )
  }

  @Query(() => VmstApplicationsAvailableActions, {
    name: 'vmstApplicantAvailableActions',
  })
  @Audit()
  async getApplicantAvailableActions(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    return this.vmstApplicationsService.getApplicantActions(applicantId)
  }

  @Query(() => [VmstApplicationsApplicantAttachment], {
    name: 'vmstApplicantAttachments',
  })
  @Audit()
  async getApplicantAttachments(@CurrentUser() auth: User) {
    const { applicantId } = await this.vmstApplicationsService.resolveApplicant(
      auth,
    )

    return this.vmstApplicationsService.getApplicantAttachments(
      applicantId,
      auth.nationalId,
    )
  }

  @Query(() => VmstApplicationsAttachmentTypeList, {
    name: 'vmstAttachmentTypes',
  })
  @Audit()
  async getAttachmentTypes() {
    return this.vmstApplicationsService.getAttachmentTypes()
  }

  @Query(() => VmstApplicationsAttachment, {
    name: 'vmstAttachment',
  })
  @Audit()
  async getAttachment(@Args('id') id: string) {
    return this.vmstApplicationsService.getAttachment(id)
  }
}
