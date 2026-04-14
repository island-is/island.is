import { Injectable, Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationService } from '@island.is/application/api/core'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  Application,
  ApplicationWithAttachments,
  ExternalData,
  FormValue,
  RoleInState,
} from '@island.is/application/types'
import {
  convertFormToScreens,
  getNavigableSectionsInForm,
  moveToScreen,
  findCurrentScreen,
  canGoBack,
  FormScreen,
  getFormNodeFieldIds,
} from '@island.is/application/screen-compiler'
import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { ApplicationActionService } from '../application/application-action.service'
import { I18nResolverService, FormTextResolver } from './i18n-resolver.service'
import { mapScreenToComponents } from './screen-mapper'
import { buildStepper } from './stepper-builder'
import { buildFooterButtons } from './footer-builder'
import {
  ScreenDto,
  PageDto,
  ValidationErrorDto,
  ValidateResponseDto,
} from './dto/screen.dto'

interface AdapterOptions {
  ephemeral?: boolean
}

@Injectable()
export class AstAdapterService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly applicationService: ApplicationService,
    private readonly i18nResolverService: I18nResolverService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly applicationActionService: ApplicationActionService,
  ) {}

  async getScreen(
    applicationId: string,
    pageIndex: number | undefined,
    locale: Locale,
    user: User,
    options: AdapterOptions = {},
  ): Promise<ScreenDto> {
    const startTime = Date.now()

    // Step 1: Load Application
    const application = (await this.applicationService.findOneById(
      applicationId,
    )) as ApplicationWithAttachments
    this.logTiming('Step 1: Load Application', startTime)

    // Step 2: Load Template
    const step2Start = Date.now()
    const template = await getApplicationTemplateByTypeId(
      application.typeId,
    )
    this.logTiming('Step 2: Load Template', step2Start)

    // Step 3: Resolve Role & Form
    const step3Start = Date.now()
    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) {
      throw new Error(
        `User ${user.nationalId} has no role for application ${applicationId} in state ${application.state}`,
      )
    }

    const helper = new ApplicationTemplateHelper(
      application as Application,
      template,
    )
    const stateInfo = helper.getApplicationStateInformation(application.state)
    if (!stateInfo) {
      throw new Error(
        `No state information for state ${application.state}`,
      )
    }

    const roleInState = stateInfo.roles?.find((r) => r.id === role)
    if (!roleInState) {
      throw new Error(
        `Role ${role} not found in state ${application.state}`,
      )
    }

    const form = await this.loadForm(roleInState, application)
    this.logTiming('Step 3: Resolve Role & Form', step3Start)

    // Step 3.5: Apply Role-Based Data Filtering (SECURITY-CRITICAL)
    const step35Start = Date.now()
    const { answers: filteredAnswers, externalData: filteredExternalData } =
      this.filterDataByRole(application as Application, roleInState)
    this.logTiming('Step 3.5: Role-Based Data Filtering', step35Start)

    // Step 4: Compile Form to Screens
    const step4Start = Date.now()
    const bffUser = {
      nationalId: user.nationalId,
      profile: { nationalId: user.nationalId, name: '', locale },
    }
    const screens = convertFormToScreens(
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser as any,
    )
    this.logTiming('Step 4: Compile Form to Screens', step4Start)

    // Step 5: Resolve Current Screen
    const step5Start = Date.now()
    let resolvedIndex: number
    if (pageIndex !== undefined && pageIndex >= 0) {
      resolvedIndex = moveToScreen(screens, pageIndex, true)
    } else {
      resolvedIndex = findCurrentScreen(screens, filteredAnswers)
    }
    const currentScreen = screens[resolvedIndex]
    this.logTiming('Step 5: Resolve Current Screen', step5Start)

    // Step 6: Build Stepper
    const step6Start = Date.now()
    const resolver = await this.i18nResolverService.createResolver(
      application as Application,
      locale,
    )
    const navigableSections = getNavigableSectionsInForm(
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser as any,
    )
    const stepper = buildStepper(
      navigableSections,
      currentScreen?.sectionIndex ?? 0,
      currentScreen?.subSectionIndex ?? 0,
      resolver,
    )
    this.logTiming('Step 6: Build Stepper', step6Start)

    // Step 7: Build Page
    const step7Start = Date.now()
    const page = this.buildPage(
      currentScreen,
      resolvedIndex,
      resolver,
      application as Application,
    )
    this.logTiming('Step 7: Build Page', step7Start)

    // Step 8: Build Footer
    const step8Start = Date.now()
    const footerButtons = buildFooterButtons(
      roleInState.actions,
      filteredAnswers,
      filteredExternalData,
      bffUser as any,
      resolver,
    )
    const footer = {
      buttons: footerButtons,
      canGoBack: canGoBack(screens, resolvedIndex),
    }
    this.logTiming('Step 8: Build Footer', step8Start)

    // Step 9: Build Header
    const header = {
      title: resolver.resolve(form.title),
      description: undefined,
    }

    // Step 10: Assemble & Return Screen
    this.logTiming('Total pipeline', startTime)

    return {
      applicationId,
      header,
      stepper,
      page,
      footer,
      locale,
    }
  }

  async validateFields(
    applicationId: string,
    answers: Record<string, unknown>,
    fieldIds: string[],
    locale: Locale,
    user: User,
  ): Promise<ValidateResponseDto> {
    const application = (await this.applicationService.findOneById(
      applicationId,
    )) as ApplicationWithAttachments

    const template = await getApplicationTemplateByTypeId(
      application.typeId,
    )

    const errors: ValidationErrorDto[] = []

    if (template.dataSchema) {
      try {
        const mergedAnswers = { ...application.answers, ...answers }
        const result = template.dataSchema.safeParse(mergedAnswers)
        if (!result.success) {
          for (const issue of result.error.issues) {
            const path = issue.path.join('.')
            if (fieldIds.includes(path)) {
              errors.push({
                componentId: path,
                message: issue.message,
              })
            }
          }
        }
      } catch (e) {
        this.logger.error('Validation error', e)
      }
    }

    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (role) {
      const helper = new ApplicationTemplateHelper(
        application as Application,
        template,
      )
      const formatResolver = await this.i18nResolverService.createResolver(
        application as Application,
        locale,
      )
      const validatorErrors = await helper.applyAnswerValidators(
        answers as FormValue,
        (descriptor, values) => formatResolver.resolve(descriptor as any),
      )
      if (validatorErrors) {
        for (const [path, message] of Object.entries(validatorErrors)) {
          if (fieldIds.includes(path)) {
            errors.push({ componentId: path, message })
          }
        }
      }
    }

    return { errors }
  }

  async persistAnswersAndAdvance(
    applicationId: string,
    answers: Record<string, unknown>,
    lastKnownPageIndex: number,
    locale: Locale,
    user: User,
  ): Promise<ScreenDto> {
    const application = (await this.applicationService.findOneById(
      applicationId,
    )) as ApplicationWithAttachments

    const currentPageIndex =
      (application as any).pageIndex ?? lastKnownPageIndex

    if (
      currentPageIndex !== undefined &&
      currentPageIndex !== lastKnownPageIndex
    ) {
      throw new Error(
        `Idempotency check failed: lastKnownPageIndex ${lastKnownPageIndex} does not match persisted ${currentPageIndex}`,
      )
    }

    const mergedAnswers = { ...application.answers, ...answers } as FormValue

    // Validate answers before persisting (§6.3: scoped Zod + answerValidators)
    const template = await getApplicationTemplateByTypeId(application.typeId)
    const validationErrors = await this.validateAnswersForPage(
      application,
      template,
      mergedAnswers,
      answers,
      lastKnownPageIndex,
      locale,
      user,
    )

    if (validationErrors.length > 0) {
      const resolver = await this.i18nResolverService.createResolver(
        application as Application,
        locale,
      )
      const screen = await this.getScreen(
        applicationId,
        lastKnownPageIndex,
        locale,
        user,
      )
      screen.page.errors = validationErrors
      return screen
    }

    await this.applicationService.update(applicationId, {
      answers: mergedAnswers,
    } as any)

    const newPageIndex = lastKnownPageIndex + 1
    return this.getScreen(applicationId, newPageIndex, locale, user)
  }

  private async validateAnswersForPage(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    mergedAnswers: FormValue,
    newAnswers: Record<string, unknown>,
    pageIndex: number,
    locale: Locale,
    user: User,
  ): Promise<ValidationErrorDto[]> {
    const errors: ValidationErrorDto[] = []

    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) return errors

    const helper = new ApplicationTemplateHelper(
      application as Application,
      template,
    )
    const roleInState = helper.getRoleInState(role)
    if (!roleInState?.formLoader) return errors

    const form = await roleInState.formLoader({
      featureFlagClient: this.featureFlagService,
    } as any)

    const bffUser = {
      nationalId: user.nationalId,
      profile: { nationalId: user.nationalId, name: '', locale },
    }
    const { answers: filteredAnswers, externalData: filteredExternalData } =
      this.filterDataByRole(application as Application, roleInState)

    const screens = convertFormToScreens(
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser as any,
    )
    const resolvedIndex = moveToScreen(screens, pageIndex, true)
    const currentScreen = screens[resolvedIndex]

    if (currentScreen) {
      const fieldIds = getFormNodeFieldIds(currentScreen as any)

      if (template.dataSchema && fieldIds.length > 0) {
        try {
          const result = template.dataSchema.safeParse(mergedAnswers)
          if (!result.success) {
            for (const issue of result.error.issues) {
              const path = issue.path.join('.')
              if (fieldIds.includes(path)) {
                errors.push({ componentId: path, message: issue.message })
              }
            }
          }
        } catch (e) {
          this.logger.error('Zod validation error during NEXT_PAGE', e)
        }
      }

      const formatResolver = await this.i18nResolverService.createResolver(
        application as Application,
        locale,
      )
      const validatorErrors = await helper.applyAnswerValidators(
        newAnswers as FormValue,
        (descriptor, values) => formatResolver.resolve(descriptor as any),
      )
      if (validatorErrors) {
        for (const [path, message] of Object.entries(validatorErrors)) {
          if (fieldIds.includes(path)) {
            errors.push({ componentId: path, message })
          }
        }
      }
    }

    return errors
  }

  async handleSubmit(
    applicationId: string,
    event: string,
    answers: Record<string, unknown> | undefined,
    locale: Locale,
    user: User,
  ): Promise<ScreenDto> {
    const application = (await this.applicationService.findOneById(
      applicationId,
    )) as ApplicationWithAttachments

    if (answers && Object.keys(answers).length > 0) {
      const mergedAnswers = { ...application.answers, ...answers }
      await this.applicationService.update(applicationId, {
        answers: mergedAnswers,
      } as any)
    }

    const template = await getApplicationTemplateByTypeId(
      application.typeId,
    )

    const eventStr = event || 'SUBMIT'

    const result = await this.applicationActionService.changeState(
      application,
      template,
      eventStr,
      user,
      locale,
    )

    if (result.hasError) {
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : 'State transition failed',
      )
    }

    return this.getScreen(applicationId, 0, locale, user)
  }

  private async loadForm(
    roleInState: RoleInState,
    application: ApplicationWithAttachments,
  ) {
    if (!roleInState.formLoader) {
      throw new Error('No formLoader defined for role in current state')
    }
    const featureFlagClient = this.featureFlagService
    return roleInState.formLoader({ featureFlagClient } as any)
  }

  private filterDataByRole(
    application: Application,
    roleInState: RoleInState,
  ): { answers: FormValue; externalData: ExternalData } {
    const { read, write } = roleInState

    if (read === 'all' || write === 'all') {
      return {
        answers: { ...application.answers },
        externalData: { ...application.externalData },
      }
    }

    if (!read && !write) {
      return {
        answers: { ...application.answers },
        externalData: { ...application.externalData },
      }
    }

    const filteredAnswers: FormValue = {}
    const filteredExternalData: ExternalData = {}

    const readObj = typeof read === 'object' ? read : undefined
    const writeObj = typeof write === 'object' ? write : undefined

    const readAnswerKeys = readObj?.answers ?? []
    const writeAnswerKeys = writeObj?.answers ?? []
    const answerKeys = [...new Set([...readAnswerKeys, ...writeAnswerKeys])]

    for (const key of answerKeys) {
      if (key in application.answers) {
        filteredAnswers[key] = application.answers[key]
      }
    }

    const readExtKeys = readObj?.externalData ?? []
    const writeExtKeys = writeObj?.externalData ?? []
    const externalDataKeys = [...new Set([...readExtKeys, ...writeExtKeys])]

    for (const key of externalDataKeys) {
      if (key in application.externalData) {
        filteredExternalData[key] = application.externalData[key]
      }
    }

    return { answers: filteredAnswers, externalData: filteredExternalData }
  }

  private buildPage(
    screen: FormScreen,
    index: number,
    resolver: FormTextResolver,
    application: Application,
  ): PageDto {
    const components = mapScreenToComponents(screen, resolver, application)
    return {
      id: screen.id ?? `page-${index}`,
      index,
      sectionIndex: screen.sectionIndex ?? 0,
      subSectionIndex: screen.subSectionIndex ?? 0,
      components,
      errors: [],
    }
  }

  private logTiming(label: string, startTime: number) {
    const elapsed = Date.now() - startTime
    this.logger.debug(`AstAdapter ${label}: ${elapsed}ms`)
  }
}
