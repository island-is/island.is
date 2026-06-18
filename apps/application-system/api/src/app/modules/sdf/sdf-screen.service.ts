import {
  Injectable,
  Inject,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationService } from '@island.is/application/api/core'
import {
  ApplicationTemplateHelper,
  getFormExpressionDependencies,
  getValueViaPath,
  resolveFormItemId,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  Application,
  ApplicationWithAttachments,
  ExternalData,
  FieldTypes,
  Form,
  FormExpression,
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
import { getApplicationNameTranslationString } from '../application/utils/application'
import { isNewActor } from '../application/utils/delegationUtils'
import { I18nResolverService, FormTextResolver } from './i18n-resolver.service'
import { mapScreenToComponents } from './screen-mapper'
import { applyResolvedFieldDefaults } from './field-default-persistence'
import { applyFlatAnswers } from './apply-flat-answers'
import { stripEmptyFormValue } from './strip-empty-answers'
import { buildStepper } from './stepper-builder'
import { buildFooterButtons } from './footer-builder'
import {
  ScreenDto,
  PageDto,
  ValidationErrorDto,
  ValidateResponseDto,
} from './dto/screen.dto'
import { SdfActionType } from './dto/action.dto'

// vanilla-extract's `style()` needs a build-tool "file scope" that doesn't exist
// on the server. Set a no-op scope so importing form templates doesn't throw; the
// generated class names are discarded since we only need the form AST.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { setFileScope } = require('@vanilla-extract/css/fileScope')
  setFileScope('sdf-server-shim', 'application-system-api')
} catch {
  // vanilla-extract not available; CSS-free templates still work
}

interface AdapterOptions {
  ephemeral?: boolean
  application?: ApplicationWithAttachments
}

type ApplicationTemplate = Awaited<
  ReturnType<typeof getApplicationTemplateByTypeId>
>

type ApplicationWithPageIndex = ApplicationWithAttachments & {
  pageIndex?: number
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
  bffUser: BffUser
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

    const step7Start = Date.now()
    const page = this.buildPage(
      currentScreen,
      resolvedIndex,
      resolver,
      application as Application,
      bffUser,
    )
    this.logTiming('Step 7: Build Page', step7Start)

    const step8Start = Date.now()
    const footer = this.buildFooter(
      context,
      currentScreen,
      resolvedIndex,
      resolver,
    )
    this.logTiming('Step 8: Build Footer', step8Start)

    const header = this.buildHeader(context, currentScreen, resolver)

    const pageAnswers = this.extractPageAnswers(currentScreen, application)

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
    const application =
      options.application ??
      (await this.requireApplicationForUser(applicationId, user))
    this.logTiming('Step 1: Load Application', pipelineStartTime)

    const step2Start = Date.now()
    const template = await getApplicationTemplateByTypeId(application.typeId)
    this.logTiming('Step 2: Load Template', step2Start)

    const step3Start = Date.now()
    const roleInState = this.resolveRoleInState(application, template, user)
    const form = await this.loadForm(roleInState, application)
    this.logTiming('Step 3: Resolve Role & Form', step3Start)

    // Security-critical: filter answers/external data by role before rendering.
    const step35Start = Date.now()
    const { answers: filteredAnswers, externalData: filteredExternalData } =
      this.filterDataByRole(application, roleInState)
    this.logTiming('Step 3.5: Role-Based Data Filtering', step35Start)

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

  private buildBffUser(user: User, locale: Locale): BffUser {
    return {
      scopes: user.scope ?? [],
      profile: {
        sid: user.sid ?? '',
        nationalId: user.nationalId,
        name: '',
        idp: '',
        subjectType: 'person',
        delegationType: user.delegationType,
        actor: user.actor
          ? { nationalId: user.actor.nationalId, name: '' }
          : undefined,
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
    // Ephemeral (REFETCH) renders keep the persisted index so the client never
    // advances ahead of what NEXT_PAGE committed.
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
    if (!ephemeral && persistedPageIndex === 0 && hasAnswers) {
      // Migration fallback for existing apps with no persisted page index:
      // infer from answers and persist once. Skipped for ephemeral renders,
      // which can't persist and would desync the cursor from the client.
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

    // Name comes from the template, not `form.title`: NOT_STARTED forms have an
    // empty title which would leave the header name blank.
    const applicationName = getApplicationNameTranslationString(
      context.template,
      context.application as Application,
      resolver.format,
    )
    const institutionName = context.template.institution
      ? resolver.format(context.template.institution)
      : context.application.institution ?? undefined

    return {
      title: resolver.resolve(currentScreen?.title || context.form.title),
      description,
      applicationName,
      institutionName,
      // Logos are non-serializable React components; send the export name for the
      // client to resolve from @island.is/application/assets/institution-logos.
      logo: context.form.logo?.name,
    }
  }

  private extractPageAnswers(
    currentScreen: FormScreen,
    application: ApplicationWithAttachments,
  ): Record<string, unknown> {
    const pageFieldIds = new Set([
      ...getFormNodeFieldIds(currentScreen),
      ...this.extractClientExpressionAnswerIds(currentScreen),
    ])
    const pageAnswers: Record<string, unknown> = {}
    const storedAnswers = application.answers ?? {}

    for (const fieldId of pageFieldIds) {
      // Answers are stored nested (e.g. `applicant.phoneNumber`); read by path and
      // return under the flat field id the client keys on. Fall back to a literal
      // flat key for older applications written before nested normalization.
      const value =
        getValueViaPath(storedAnswers, fieldId) ??
        (fieldId in storedAnswers ? storedAnswers[fieldId] : undefined)
      if (value !== undefined) {
        pageAnswers[fieldId] = value
      }
    }

    return pageAnswers
  }

  private extractClientExpressionAnswerIds(node: unknown): string[] {
    const ids = new Set<string>()

    const visit = (value: unknown) => {
      if (typeof value !== 'object' || value === null) {
        return
      }

      const record = value as Record<string, unknown>
      for (const expressionKey of ['clientShowWhen', 'clientValueExpression']) {
        idsForExpression(record[expressionKey]).forEach((id) => ids.add(id))
      }

      const children = record.children
      if (Array.isArray(children)) {
        children.forEach(visit)
      }
    }

    const idsForExpression = (expression: unknown): string[] =>
      getFormExpressionDependencies(expression as FormExpression | undefined)

    visit(node)

    return Array.from(ids)
  }

  /**
   * Recomputes the current screen against an in-memory answer snapshot without
   * persisting anything. Template APIs run through the ephemeral action path,
   * mutating only the in-memory application used to render the response.
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

    const mergedAnswers = applyFlatAnswers(application.answers, answers)

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
    pageIndexOverride?: number,
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
    const mergedAnswers = applyFlatAnswers(application.answers, answers)

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
        applyFlatAnswers({}, answers),
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
      pageIndexOverride,
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
   * For every `FieldTypes.DISPLAY` field on the page, runs its `value(answers,
   * externalData)` closure against the merged answers and resolves the result.
   * Side-effect free; per-field failures are swallowed so one broken display
   * field can't fail the whole VALIDATE action.
   */
  private async computeDisplayValues(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    mergedAnswers: Record<string, unknown>,
    locale: Locale,
    user: User,
    resolver: FormTextResolver,
    pageIndexOverride?: number,
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {}

    const pageIndex: number =
      pageIndexOverride ??
      (application as ApplicationWithPageIndex).pageIndex ??
      0
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
      if (field.clientValueExpression !== undefined) continue
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

    // Expand the flat dotted-key payload into the nested shape the schema expects
    // and deep-merge onto the persisted tree. See `applyFlatAnswers`.
    const mergedAnswers = applyFlatAnswers(application.answers, answers)

    const template = await getApplicationTemplateByTypeId(application.typeId)

    const currentScreen = await this.getCurrentScreen(
      application,
      template,
      currentPageIndex,
      locale,
      user,
    )

    // Seed resolved field defaults for the page being left (legacy committed each
    // field's `defaultValue` on submit). Runs before validation and page-advance
    // so both see the values; mutates `mergedAnswers` in place.
    applyResolvedFieldDefaults(
      currentScreen,
      mergedAnswers,
      application as Application,
      locale,
    )

    // Validate the page being left before any side effects. EDP screens validate
    // the provider node's own id (e.g. `approveExternalData`), so an unchecked
    // approval can't advance.
    const validationErrors = await this.validateScreenAnswers(
      currentScreen,
      template,
      application,
      mergedAnswers,
      answers,
      locale,
    )
    if (validationErrors.length > 0) {
      // Re-render against the just-submitted answers (not the persisted ones) so
      // in-progress input is preserved behind the error. Rebuilding from the
      // persisted application would drop unpersisted answers and collapse
      // dependent options and computed display values.
      const workingApplication = {
        ...toApplicationSnapshot(application),
        answers: mergedAnswers,
      } as ApplicationWithAttachments
      const screen = await this.getScreen(
        applicationId,
        currentPageIndex,
        locale,
        user,
        { ephemeral: true, application: workingApplication },
      )
      screen.page.errors = validationErrors
      return screen
    }

    // Record the acting delegate on the application when answers are persisted,
    // matching the legacy `PUT /applications/:id` update path. See
    // ApplicationController.update.
    const applicantActors: string[] =
      isNewActor(application, user) && !!user.actor?.nationalId
        ? [...application.applicantActors, user.actor.nationalId]
        : application.applicantActors

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

      const newPageIndex = await this.resolveAdvancedPageIndex(
        application,
        template,
        mergedAnswers,
        currentPageIndex,
        locale,
        user,
      )
      await this.applicationService.update(applicationId, {
        // Strip empty strings on write to match legacy, which never persisted an
        // untouched optional field. Only the write is normalized; validation above
        // ran on the unstripped merge.
        answers: stripEmptyFormValue(mergedAnswers),
        applicantActors,
        pageIndex: newPageIndex,
      })

      return this.getScreen(applicationId, undefined, locale, user)
    }

    const newPageIndex = await this.resolveAdvancedPageIndex(
      application,
      template,
      mergedAnswers,
      currentPageIndex,
      locale,
      user,
    )
    await this.applicationService.update(applicationId, {
      // Strip empty strings on write to match legacy; validation above ran on the
      // unstripped merge. See the EDP branch above.
      answers: stripEmptyFormValue(mergedAnswers),
      applicantActors,
      pageIndex: newPageIndex,
    })

    return this.getScreen(applicationId, undefined, locale, user)
  }

  private async buildScreens(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    locale: Locale,
    user: User,
  ): Promise<FormScreen[] | undefined> {
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

    const bffUser = this.buildBffUser(user, locale)
    const { answers: filteredAnswers, externalData: filteredExternalData } =
      this.filterDataByRole(application as Application, roleInState)

    return convertFormToScreens(
      form,
      filteredAnswers,
      filteredExternalData,
      bffUser,
    )
  }

  private async getCurrentScreen(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    pageIndex: number,
    locale: Locale,
    user: User,
  ): Promise<FormScreen | undefined> {
    const screens = await this.buildScreens(application, template, locale, user)
    if (!screens) return undefined

    const resolvedIndex = moveToScreen(screens, pageIndex, true)
    return screens[resolvedIndex]
  }

  // Index of the next *navigable* screen after `currentPageIndex`, computed
  // against the just-submitted answers (which can flip page visibility). The
  // persisted cursor must land on a navigable screen, otherwise it desyncs from
  // the client's echoed `lastKnownPageIndex` and breaks the idempotency check.
  private async resolveAdvancedPageIndex(
    application: ApplicationWithAttachments,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    mergedAnswers: FormValue,
    currentPageIndex: number,
    locale: Locale,
    user: User,
  ): Promise<number> {
    const target = currentPageIndex + 1
    const workingApplication = {
      ...toApplicationSnapshot(application),
      answers: mergedAnswers,
    } as ApplicationWithAttachments
    const screens = await this.buildScreens(
      workingApplication,
      template,
      locale,
      user,
    )
    if (!screens) return target

    return moveToScreen(screens, target, true)
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

  // Jump directly to a page by id (overview "Breyta"/edit button), landing on the
  // nearest navigable screen and persisting the cursor like NEXT_PAGE/PREV_PAGE.
  async goToPage(
    applicationId: string,
    targetPageId: string,
    locale: Locale,
    user: User,
  ): Promise<ScreenDto> {
    const application = await this.requireApplicationForUser(
      applicationId,
      user,
    )
    const template = await getApplicationTemplateByTypeId(application.typeId)

    const screens = await this.buildScreens(application, template, locale, user)
    if (screens) {
      const bffUser = this.buildBffUser(user, locale)
      const targetIndex = screens.findIndex(
        (screen) =>
          resolveFormItemId(screen, application, bffUser) === targetPageId,
      )
      if (targetIndex >= 0) {
        const newPageIndex = moveToScreen(screens, targetIndex, false)
        const currentPageIndex: number = (application as any).pageIndex ?? 0
        if (newPageIndex !== currentPageIndex) {
          await this.applicationService.update(applicationId, {
            pageIndex: newPageIndex,
          })
        }
      }
    }

    return this.getScreen(applicationId, undefined, locale, user)
  }

  /**
   * Validates a screen's answers against the template `dataSchema` and answer
   * validators, scoped to that screen's fields.
   *
   * EXTERNAL_DATA_PROVIDER screens carry their required answer (e.g.
   * `approveExternalData`) on the node's own `id` rather than in `children`, so
   * we validate the node id directly to block an unchecked approval.
   */
  private async validateScreenAnswers(
    currentScreen: FormScreen | undefined,
    template: Awaited<ReturnType<typeof getApplicationTemplateByTypeId>>,
    application: ApplicationWithAttachments,
    mergedAnswers: FormValue,
    newAnswers: Record<string, unknown> | undefined,
    locale: Locale,
  ): Promise<ValidationErrorDto[]> {
    const errors: ValidationErrorDto[] = []
    if (!currentScreen) return errors

    const isExternalDataProvider =
      'type' in currentScreen &&
      currentScreen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER

    const fieldIds = isExternalDataProvider
      ? currentScreen.id
        ? [currentScreen.id]
        : []
      : getFormNodeFieldIds(currentScreen as any)

    if (fieldIds.length === 0) return errors

    if (template.dataSchema) {
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
        this.logger.error('Zod validation error during screen validation', e)
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
    const validatorErrors = await helper.applyAnswerValidators(
      applyFlatAnswers({}, newAnswers),
      (descriptor, values) => formatResolver.resolve(descriptor as any),
    )
    if (validatorErrors) {
      for (const [path, message] of Object.entries(validatorErrors)) {
        if (fieldIds.includes(path)) {
          errors.push({ componentId: path, message })
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

    // Validate the originating screen before transitioning, so e.g. an unchecked
    // prerequisites approval can't trigger `changeState`. Non-input screens (e.g.
    // the overview) have no schema-backed field ids, so this is a no-op for them.
    const currentPageIndex: number =
      (application as ApplicationWithPageIndex).pageIndex ?? 0
    const submitMergedAnswers = applyFlatAnswers(application.answers, answers)
    const currentScreen = await this.getCurrentScreen(
      application,
      template,
      currentPageIndex,
      locale,
      user,
    )
    const validationErrors = await this.validateScreenAnswers(
      currentScreen,
      template,
      application,
      submitMergedAnswers,
      answers,
      locale,
    )
    if (validationErrors.length > 0) {
      const workingApplication = {
        ...toApplicationSnapshot(application),
        answers: submitMergedAnswers,
      } as ApplicationWithAttachments
      const screen = await this.getScreen(
        applicationId,
        currentPageIndex,
        locale,
        user,
        { ephemeral: true, application: workingApplication },
      )
      screen.page.errors = validationErrors
      return screen
    }

    if (answers && Object.keys(answers).length > 0) {
      const mergedAnswers = applyFlatAnswers(application.answers, answers)
      await this.applicationService.update(applicationId, {
        // Strip empty strings on write to match legacy; see persistAnswersAndAdvance.
        answers: stripEmptyFormValue(mergedAnswers),
      })
      application = await this.requireApplicationForUser(applicationId, user)
    }

    // `requireApplicationForUser` returns a Sequelize model whose attributes live
    // behind prototype getters. `changeState` spreads the application, which drops
    // those getters (leaving `typeId` undefined and crashing `CreateChargeApi`).
    // Pass a plain snapshot so the spread preserves every field.
    const applicationSnapshot = toApplicationSnapshot(
      application,
    ) as ApplicationWithAttachments

    const helper = new ApplicationTemplateHelper(
      applicationSnapshot as Application,
      template,
    )
    const apisFromRole = helper.getApisFromRoleInState(role)
    if (apisFromRole.length > 0) {
      await this.applicationActionService.performActionOnApplication(
        applicationSnapshot,
        template,
        user,
        apisFromRole,
        locale,
        event || 'SUBMIT',
      )
    }

    const eventStr = event || 'SUBMIT'

    const result = await this.applicationActionService.changeState(
      applicationSnapshot,
      template,
      eventStr,
      user,
      locale,
    )

    if (result.hasError) {
      // A failed `onEntry` action (e.g. `CreateChargeApi`) aborts the transition.
      // Log the full reason server-side and propagate it to the client.
      const reason =
        typeof result.error === 'string'
          ? result.error
          : JSON.stringify(result.error ?? {})
      this.logger.error(
        `SDF SUBMIT failed to transition application ${applicationId} on event "${eventStr}": ${reason}`,
      )
      throw new Error(
        `State transition failed for event "${eventStr}": ${reason}`,
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
    user?: BffUser,
  ): PageDto {
    const components = mapScreenToComponents(screen, resolver, application, user)
    return {
      id: resolveFormItemId(screen, application, user) || `page-${index}`,
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
