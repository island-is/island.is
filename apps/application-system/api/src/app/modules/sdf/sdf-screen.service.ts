import {
  Injectable,
  Inject,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationService } from '@island.is/application/api/core'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  Application,
  ApplicationWithAttachments,
  ExternalData,
  FieldTypes,
  Form,
  FormItemTypes,
  FormValue,
  RoleInState,
  TemplateApi,
} from '@island.is/application/types'
import {
  convertFormToScreens,
  getNavigableSectionsInForm,
  moveToScreen,
  findCurrentScreen,
  canGoBack,
  FormScreen,
  ExternalDataProviderScreen,
  getFormNodeFieldIds,
} from '@island.is/application/screen-compiler'
import type { User } from '@island.is/auth-nest-tools'
import type { BffUser, Locale } from '@island.is/shared/types'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { ApplicationActionService } from '../application/application-action.service'
import { ApplicationAccessService } from '../application/tools/applicationAccess.service'
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
import { SdfActionType } from './dto/action.dto'

// Vanilla-extract CSS files (.css.ts) import `style()` which requires a
// build-tool-managed "file scope". On the server there is no build tool running,
// so we set a persistent no-op scope. The generated class-name strings are
// thrown away — we only need the form AST, not actual CSS.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { setFileScope } = require('@vanilla-extract/css/fileScope')
  setFileScope('sdf-server-shim', 'application-system-api')
} catch {
  // vanilla-extract not available — form templates that don't use CSS will still work
}

interface AdapterOptions {
  ephemeral?: boolean
  application?: ApplicationWithAttachments
}

type ApplicationTemplate = Awaited<
  ReturnType<typeof getApplicationTemplateByTypeId>
>

type SdfBffUser = BffUser & {
  nationalId: string
}

type ScreenWithDescription = FormScreen & {
  description?: Parameters<FormTextResolver['resolve']>[0]
}

interface ScreenRenderContext {
  application: ApplicationWithAttachments
  template: ApplicationTemplate
  roleInState: RoleInState
  form: Form
  filteredAnswers: FormValue
  filteredExternalData: ExternalData
  bffUser: SdfBffUser
  screens: FormScreen[]
}

type ApplicationSnapshotInput = Partial<ApplicationWithAttachments> & {
  toJSON?: () => Partial<ApplicationWithAttachments>
}

const toApplicationSnapshot = (
  application: ApplicationSnapshotInput,
): Partial<ApplicationWithAttachments> => {
  if (typeof application.toJSON === 'function') {
    return application.toJSON()
  }

  return { ...application }
}

@Injectable()
export class SdfScreenService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly applicationService: ApplicationService,
    private readonly applicationAccessService: ApplicationAccessService,
    private readonly i18nResolverService: I18nResolverService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly applicationActionService: ApplicationActionService,
  ) {}

  /**
   * Same access rules as GET /applications/:id — applicant, assignee, actor edge
   * cases, and template role fallback (see ApplicationAccessService).
   */
  private async requireApplicationForUser(
    applicationId: string,
    user: User,
  ): Promise<ApplicationWithAttachments> {
    const application =
      await this.applicationAccessService.findOneByIdAndNationalId(
        applicationId,
        user,
      )
    return application as ApplicationWithAttachments
  }

  async getScreen(
    applicationId: string,
    pageIndexOverride: number | undefined,
    locale: Locale,
    user: User,
    options: AdapterOptions = {},
  ): Promise<ScreenDto> {
    const startTime = Date.now()

    const context = await this.resolveScreenRenderContext(
      applicationId,
      locale,
      user,
      options,
      startTime,
    )
    const {
      application,
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser,
      screens,
    } = context

    // Step 5: Resolve Current Screen
    const step5Start = Date.now()
    const resolvedIndex = await this.resolvePageIndex(
      applicationId,
      application,
      screens,
      filteredAnswers,
      pageIndexOverride,
      Boolean(options.ephemeral),
    )
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
      bffUser,
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
    const footer = this.buildFooter(
      context,
      currentScreen,
      resolvedIndex,
      resolver,
    )
    this.logTiming('Step 8: Build Footer', step8Start)

    // Step 9: Build Header
    const header = this.buildHeader(context, currentScreen, resolver)

    // Step 10: Extract persisted answers for current page fields
    const pageAnswers = this.extractPageAnswers(currentScreen, application)

    // Step 11: Assemble & Return Screen
    this.logTiming('Total pipeline', startTime)

    return {
      applicationId,
      header,
      stepper,
      page,
      footer,
      locale,
      answers: Object.keys(pageAnswers).length > 0 ? pageAnswers : undefined,
    }
  }

  private async resolveScreenRenderContext(
    applicationId: string,
    locale: Locale,
    user: User,
    options: AdapterOptions,
    pipelineStartTime: number,
  ): Promise<ScreenRenderContext> {
    // Step 1: Load Application
    const application =
      options.application ??
      (await this.requireApplicationForUser(applicationId, user))
    this.logTiming('Step 1: Load Application', pipelineStartTime)

    // Step 2: Load Template
    const step2Start = Date.now()
    const template = await getApplicationTemplateByTypeId(application.typeId)
    this.logTiming('Step 2: Load Template', step2Start)

    // Step 3: Resolve Role & Form
    const step3Start = Date.now()
    const roleInState = this.resolveRoleInState(application, template, user)
    const form = await this.loadForm(roleInState, application)
    this.logTiming('Step 3: Resolve Role & Form', step3Start)

    // Step 3.5: Apply Role-Based Data Filtering (SECURITY-CRITICAL)
    const step35Start = Date.now()
    const { answers: filteredAnswers, externalData: filteredExternalData } =
      this.filterDataByRole(application, roleInState)
    this.logTiming('Step 3.5: Role-Based Data Filtering', step35Start)

    // Step 4: Compile Form to Screens
    const step4Start = Date.now()
    const bffUser = this.buildBffUser(user, locale)
    const screens = convertFormToScreens(
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser,
    )
    this.logTiming('Step 4: Compile Form to Screens', step4Start)

    return {
      application,
      template,
      roleInState,
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser,
      screens,
    }
  }

  private resolveRoleInState(
    application: ApplicationWithAttachments,
    template: ApplicationTemplate,
    user: User,
  ): RoleInState {
    const role = template.mapUserToRole(user.nationalId, application)
    if (!role) {
      throw new ForbiddenException('Access denied')
    }

    const helper = new ApplicationTemplateHelper(application, template)

    const stateInfo = helper.getApplicationStateInformation(application.state)
    if (!stateInfo) {
      throw new Error(`No state information for state ${application.state}`)
    }

    const roleInState = stateInfo.roles?.find((r) => r.id === role)
    if (!roleInState) {
      throw new Error(`Role ${role} not found in state ${application.state}`)
    }

    return roleInState
  }

  private buildBffUser(user: User, locale: Locale): SdfBffUser {
    return {
      nationalId: user.nationalId,
      scopes: [],
      profile: {
        sid: '',
        nationalId: user.nationalId,
        name: '',
        idp: '',
        subjectType: 'person',
        locale,
        iss: '',
      },
    }
  }

  private async resolvePageIndex(
    applicationId: string,
    application: ApplicationWithAttachments,
    screens: FormScreen[],
    filteredAnswers: FormValue,
    pageIndexOverride: number | undefined,
    ephemeral: boolean,
  ): Promise<number> {
    // Priority: explicit override > persisted DB value > answer-based inference.
    if (pageIndexOverride !== undefined && pageIndexOverride >= 0) {
      const resolvedIndex = moveToScreen(screens, pageIndexOverride, true)
      if (!ephemeral && application.pageIndex !== pageIndexOverride) {
        await this.applicationService.update(applicationId, {
          pageIndex: resolvedIndex,
        })
      }

      return resolvedIndex
    }

    const persistedPageIndex = application.pageIndex ?? 0
    const hasAnswers = Object.keys(application.answers ?? {}).length > 0
    if (persistedPageIndex === 0 && hasAnswers && !ephemeral) {
      // Migration fallback: existing app with no persisted page index.
      // Infer from answers and persist so this only runs once.
      // Ephemeral renders (e.g. REFETCH) must not use this path: we cannot
      // persist here, and returning an inferred index would desync
      // `page.index` from `application.pageIndex` and break NEXT_PAGE
      // idempotency (lastKnownPageIndex vs persisted cursor).
      const resolvedIndex = findCurrentScreen(screens, filteredAnswers)
      await this.applicationService.update(applicationId, {
        pageIndex: resolvedIndex,
      })

      return resolvedIndex
    }

    return moveToScreen(screens, persistedPageIndex, true)
  }

  private buildFooter(
    context: ScreenRenderContext,
    currentScreen: FormScreen,
    resolvedIndex: number,
    resolver: FormTextResolver,
  ): ScreenDto['footer'] {
    const isLastScreen = !context.screens
      .slice(resolvedIndex + 1)
      .some((screen) => screen.isNavigable)

    const buttons = isLastScreen
      ? buildFooterButtons(
          context.roleInState.actions,
          context.filteredAnswers,
          context.filteredExternalData,
          context.bffUser,
          resolver,
        )
      : [
          {
            id: 'next',
            text: resolver.resolve(
              currentScreen?.nextButtonText ?? 'Halda áfram',
            ),
            variant: 'PRIMARY',
            actionType: 'NEXT_PAGE',
          },
        ]

    return {
      buttons,
      canGoBack: canGoBack(context.screens, resolvedIndex),
    }
  }

  private buildHeader(
    context: ScreenRenderContext,
    currentScreen: FormScreen,
    resolver: FormTextResolver,
  ): ScreenDto['header'] {
    const screen = currentScreen as ScreenWithDescription
    const description = screen.description
      ? resolver.resolve(screen.description)
      : undefined

    return {
      title: resolver.resolve(currentScreen?.title || context.form.title),
      description,
      applicationName: resolver.resolve(context.form.title),
      institutionName: context.application.institution ?? undefined,
    }
  }

  private extractPageAnswers(
    currentScreen: FormScreen,
    application: ApplicationWithAttachments,
  ): Record<string, unknown> {
    const pageFieldIds = getFormNodeFieldIds(currentScreen)
    const pageAnswers: Record<string, unknown> = {}

    for (const fieldId of pageFieldIds) {
      if (fieldId in (application.answers ?? {})) {
        pageAnswers[fieldId] = application.answers[fieldId]
      }
    }

    return pageAnswers
  }

  /**
   * Recomputes the current screen against an in-memory answer snapshot.
   *
   * REFETCH must not persist answers, page index, or external data. Template APIs
   * requested here run through the ephemeral action path, which mutates only the
   * in-memory application object used to render the response.
   */
  async handleRefetch(
    applicationId: string,
    answers: Record<string, unknown> | undefined,
    refetchTemplateApiActions: string[] | undefined,
    locale: Locale,
    user: User,
  ): Promise<ScreenDto> {
    const application = await this.requireApplicationForUser(
      applicationId,
      user,
    )

    const template = await getApplicationTemplateByTypeId(application.typeId)
    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) {
      throw new ForbiddenException('Access denied')
    }

    const mergedAnswers = {
      ...(application.answers ?? {}),
      ...(answers ?? {}),
    } as FormValue

    let workingApplication = {
      ...toApplicationSnapshot(application),
      answers: mergedAnswers,
    } as ApplicationWithAttachments

    const helper = new ApplicationTemplateHelper(
      workingApplication as Application,
      template,
    )
    const apisFromRole = helper.getApisFromRoleInState(role)

    const requested = (refetchTemplateApiActions ?? []).filter(Boolean)
    if (requested.length > 0) {
      const apisToRun = apisFromRole.filter((api) =>
        requested.includes(api.action),
      )
      if (apisToRun.length > 0) {
        const result =
          await this.applicationActionService.performEphemeralActionOnApplication(
            workingApplication,
            template,
            user,
            apisToRun,
            locale,
            SdfActionType.REFETCH,
          )
        if (result.hasError) {
          throw new Error(
            typeof result.error === 'string'
              ? result.error
              : 'Template API failed during REFETCH',
          )
        }
        const updatedApplication = toApplicationSnapshot(
          result.updatedApplication,
        )
        workingApplication = {
          ...workingApplication,
          ...updatedApplication,
          id: updatedApplication.id ?? workingApplication.id,
          typeId: updatedApplication.typeId ?? workingApplication.typeId,
          applicant:
            updatedApplication.applicant ?? workingApplication.applicant,
          assignees:
            updatedApplication.assignees ?? workingApplication.assignees,
          applicantActors:
            updatedApplication.applicantActors ??
            workingApplication.applicantActors,
          state: updatedApplication.state ?? workingApplication.state,
          status: updatedApplication.status ?? workingApplication.status,
          answers: updatedApplication.answers ?? workingApplication.answers,
          externalData:
            updatedApplication.externalData ?? workingApplication.externalData,
          attachments:
            updatedApplication.attachments ?? workingApplication.attachments,
          created: updatedApplication.created ?? workingApplication.created,
          modified: updatedApplication.modified ?? workingApplication.modified,
        }
      }
    }

    return this.getScreen(applicationId, undefined, locale, user, {
      ephemeral: true,
      application: workingApplication,
    })
  }

  async validateFields(
    applicationId: string,
    answers: Record<string, unknown>,
    fieldIds: string[],
    locale: Locale,
    user: User,
  ): Promise<ValidateResponseDto> {
    const application = await this.requireApplicationForUser(
      applicationId,
      user,
    )

    const template = await getApplicationTemplateByTypeId(application.typeId)

    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) {
      throw new ForbiddenException('Access denied')
    }

    const errors: ValidationErrorDto[] = []
    const mergedAnswers = { ...application.answers, ...answers }

    if (template.dataSchema && fieldIds.length > 0) {
      try {
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

    const helper = new ApplicationTemplateHelper(
      application as Application,
      template,
    )
    const formatResolver = await this.i18nResolverService.createResolver(
      application as Application,
      locale,
    )

    if (fieldIds.length > 0) {
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

    const displayValues = await this.computeDisplayValues(
      application,
      template,
      mergedAnswers,
      locale,
      user,
      formatResolver,
    )

    return {
      errors,
      displayValues:
        displayValues && Object.keys(displayValues).length > 0
          ? displayValues
          : undefined,
    }
  }

  /**
   * Walks the current page's fields and, for every `FieldTypes.DISPLAY`,
   * invokes the template-defined `value(answers, externalData)` closure
   * against the supplied merged answers. The resulting string is run through
   * the i18n resolver.
   *
   * Side-effect free (plan §2d, Constraint 1): no DB writes, no template APIs.
   * Failures in individual closures are swallowed so a single broken display
   * field cannot bring down the whole VALIDATE action.
   */
  private async computeDisplayValues(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    mergedAnswers: Record<string, unknown>,
    locale: Locale,
    user: User,
    resolver: FormTextResolver,
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {}

    const pageIndex: number = (application as any).pageIndex ?? 0
    let currentScreen: FormScreen | undefined
    try {
      currentScreen = await this.getCurrentScreen(
        application,
        template,
        pageIndex,
        locale,
        user,
      )
    } catch (e) {
      this.logger.debug(
        'computeDisplayValues: failed to resolve current screen',
        e,
      )
      return results
    }

    if (!currentScreen) return results

    const displayFields: Array<Record<string, unknown>> = []
    const maybeScreen = currentScreen as unknown as Record<string, unknown>
    if (
      'type' in maybeScreen &&
      maybeScreen.type === FormItemTypes.MULTI_FIELD
    ) {
      const children = (maybeScreen.children ?? []) as Array<
        Record<string, unknown>
      >
      for (const child of children) {
        if (child.type === FieldTypes.DISPLAY) displayFields.push(child)
      }
    } else if (
      'type' in maybeScreen &&
      maybeScreen.type === FieldTypes.DISPLAY
    ) {
      displayFields.push(maybeScreen)
    }

    if (displayFields.length === 0) return results

    const externalData = application.externalData ?? {}
    for (const field of displayFields) {
      const id = field.id as string | undefined
      if (!id) continue
      const valueFn = field.value
      if (typeof valueFn !== 'function') continue
      try {
        const computed = (
          valueFn as (answers: unknown, externalData: unknown) => unknown
        )(mergedAnswers, externalData)
        const resolved = resolver.resolve(computed as any)
        if (resolved != null) {
          results[id] = String(resolved)
        }
      } catch (e) {
        this.logger.debug(
          `computeDisplayValues: closure threw for field ${id}`,
          e,
        )
      }
    }

    return results
  }

  async persistAnswersAndAdvance(
    applicationId: string,
    answers: Record<string, unknown>,
    locale: Locale,
    user: User,
    lastKnownPageIndex?: number,
  ): Promise<ScreenDto> {
    const application = await this.requireApplicationForUser(
      applicationId,
      user,
    )

    const currentPageIndex: number = application.pageIndex ?? 0

    if (lastKnownPageIndex !== undefined) {
      if (currentPageIndex !== lastKnownPageIndex) {
        throw new ConflictException(
          `Idempotency check failed: lastKnownPageIndex ${lastKnownPageIndex} does not match persisted ${currentPageIndex}`,
        )
      }
    }

    const mergedAnswers = { ...application.answers, ...answers } as FormValue

    const template = await getApplicationTemplateByTypeId(application.typeId)

    const currentScreen = await this.getCurrentScreen(
      application,
      template,
      currentPageIndex,
      locale,
      user,
    )

    if (
      currentScreen &&
      'type' in currentScreen &&
      currentScreen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER
    ) {
      const edpScreen = currentScreen as ExternalDataProviderScreen
      const dataProviders = edpScreen.dataProviders ?? []
      const relevantProviders = dataProviders.filter((p) => p.action)

      if (relevantProviders.length > 0) {
        const role = template.mapUserToRole(
          user.nationalId,
          application as Application,
        )
        const helper = new ApplicationTemplateHelper(
          application as Application,
          template,
        )
        const apisFromRole = role ? helper.getApisFromRoleInState(role) : []

        const templateApis = relevantProviders
          .map((p) => apisFromRole.find((a) => a.actionId === p.action))
          .filter(Boolean)

        if (templateApis.length > 0) {
          const result =
            await this.applicationActionService.performActionOnApplication(
              application,
              template,
              user,
              templateApis as TemplateApi[],
              locale,
              'SUBMIT',
            )
          if (result.hasError) {
            throw new Error(
              typeof result.error === 'string'
                ? result.error
                : 'Failed to fetch external data',
            )
          }
        }
      }

      const newPageIndex = currentPageIndex + 1
      await this.applicationService.update(applicationId, {
        answers: mergedAnswers,
        pageIndex: newPageIndex,
      })

      return this.getScreen(applicationId, undefined, locale, user)
    }

    const validationErrors = await this.validateAnswersForPage(
      application,
      template,
      mergedAnswers,
      answers,
      currentPageIndex,
      locale,
      user,
    )

    if (validationErrors.length > 0) {
      const screen = await this.getScreen(
        applicationId,
        undefined,
        locale,
        user,
      )
      screen.page.errors = validationErrors
      return screen
    }

    const newPageIndex = currentPageIndex + 1
    await this.applicationService.update(applicationId, {
      answers: mergedAnswers,
      pageIndex: newPageIndex,
    })

    return this.getScreen(applicationId, undefined, locale, user)
  }

  private async getCurrentScreen(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    pageIndex: number,
    locale: Locale,
    user: User,
  ): Promise<FormScreen | undefined> {
    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) return undefined

    const helper = new ApplicationTemplateHelper(
      application as Application,
      template,
    )
    const roleInState = helper.getRoleInState(role)
    if (!roleInState?.formLoader) return undefined

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
    return screens[resolvedIndex]
  }

  async goToPreviousPage(
    applicationId: string,
    locale: Locale,
    user: User,
  ): Promise<ScreenDto> {
    const application = await this.requireApplicationForUser(
      applicationId,
      user,
    )

    const currentPageIndex: number = (application as any).pageIndex ?? 0
    const newPageIndex = Math.max(0, currentPageIndex - 1)

    if (newPageIndex !== currentPageIndex) {
      await this.applicationService.update(applicationId, {
        pageIndex: newPageIndex,
      })
    }

    return this.getScreen(applicationId, undefined, locale, user)
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
    let application = await this.requireApplicationForUser(applicationId, user)

    const template = await getApplicationTemplateByTypeId(application.typeId)

    const role = template.mapUserToRole(
      user.nationalId,
      application as Application,
    )
    if (!role) {
      throw new ForbiddenException('Access denied')
    }

    if (answers && Object.keys(answers).length > 0) {
      const mergedAnswers = { ...application.answers, ...answers }
      await this.applicationService.update(applicationId, {
        answers: mergedAnswers,
      })
      application = await this.requireApplicationForUser(applicationId, user)
    }

    const helper = new ApplicationTemplateHelper(
      application as Application,
      template,
    )
    const apisFromRole = helper.getApisFromRoleInState(role)
    if (apisFromRole.length > 0) {
      await this.applicationActionService.performActionOnApplication(
        application,
        template,
        user,
        apisFromRole,
        locale,
        event || 'SUBMIT',
      )
    }

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

    await this.applicationService.update(applicationId, {
      pageIndex: 0,
    })

    return this.getScreen(applicationId, undefined, locale, user)
  }

  private async loadForm(
    roleInState: RoleInState,
    application: ApplicationWithAttachments,
  ) {
    if (!roleInState.formLoader) {
      throw new Error('No formLoader defined for role in current state')
    }
    const featureFlagClient = this.featureFlagService
    const form = await roleInState.formLoader({ featureFlagClient } as any)

    if (!form) {
      throw new Error(
        `formLoader for role "${roleInState.id}" in state "${application.state}" returned undefined. ` +
          `Check that the form module exports the form correctly.`,
      )
    }

    if (!form.children) {
      throw new Error(
        `Form loaded for role "${roleInState.id}" has no children array. ` +
          `Expected a Form object with children, got: ${JSON.stringify(
            Object.keys(form),
          )}`,
      )
    }

    return form
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
