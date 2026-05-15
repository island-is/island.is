import { useMemo } from 'react'
import type { Application } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  FormStepperV2,
  Section,
} from '@island.is/island-ui/core'
import type { ButtonTypes } from '@island.is/island-ui/core/types'
import { coreMessages } from '@island.is/application/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateSectionNav,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import {
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
} from '../../utils/translationWorkspaceNavigation'
import { resolveTranslatableStaticText } from '../../utils/translationWorkspaceStaticText'
import {
  mergePreviewFieldRegistry,
  type PreviewFieldComponent,
} from '../../utils/previewFieldRegistry'
import { resolveSubmitActionLabel } from '../../utils/translationWorkspaceFooterSubmit'
import { TranslationWorkspaceFieldPreview } from '../TranslationWorkspaceFieldPreview/TranslationWorkspaceFieldPreview'
import { TranslationWorkspaceFormLogo } from '../TranslationWorkspaceFormLogo/TranslationWorkspaceFormLogo'
import { TranslationWorkspacePreviewShell } from '../TranslationWorkspacePreviewShell/TranslationWorkspacePreviewShell'
import * as styles from './TranslationWorkspacePreviewArea.css'

type SubmitPreviewButton = Omit<ButtonTypes, 'circle'> & {
  icon?: 'checkmark' | 'close' | 'pencil'
}

const SUBMIT_PREVIEW_BUTTON_MAP: Record<string, SubmitPreviewButton> = {
  primary: {
    icon: 'checkmark',
    colorScheme: 'default',
    variant: 'primary',
  },
  sign: {
    icon: 'pencil',
    colorScheme: 'default',
    variant: 'primary',
  },
  subtle: {
    colorScheme: 'light',
    variant: 'ghost',
  },
  signGhost: {
    icon: 'pencil',
    colorScheme: 'light',
    variant: 'ghost',
  },
  reject: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'primary',
  },
  rejectGhost: {
    icon: 'close',
    colorScheme: 'destructive',
    variant: 'ghost',
  },
}

export interface TranslationWorkspacePreviewAreaProps {
  previewScreens: ScreenIntrospection[]
  resolvePreviewString: ResolvePreviewString
  formatMessage: FormatMessage
  templateName: string
  activeFormTitle: string | null
  activeSections: TemplateSectionNav[]
  selectedLocation: SidebarNavLocation | null
  activeStateKey: string
  activeStateName: string
  activeRoleId: string
  /** Static `form.logo` component name from introspection, when available. */
  formLogoKey: string | null | undefined
  onSidebarNavClick: (
    nav: ScreenIntrospection,
    location: SidebarNavLocation,
  ) => void
  showValidationErrors: boolean
  validationDescriptorsByPath: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId: string | null
  fieldErrorOverrides: Set<string>
  previewFieldValues: Record<string, string>
  /** Optional template `getFields` overrides merged over `@island.is/application/ui-fields`. */
  customFields?: Record<string, PreviewFieldComponent>
  previewApplication: Application
  /** Translation Workspace locale used by preview `intl` bridge and form context. */
  activeLocale: 'is' | 'en'
  /** `buildSubmitField` with `placement: 'footer'` — actions rendered in preview chrome. */
  footerSubmitScreen?: ScreenIntrospection
}

export const TranslationWorkspacePreviewArea = ({
  previewScreens,
  resolvePreviewString,
  formatMessage,
  templateName,
  activeFormTitle,
  activeSections,
  selectedLocation,
  activeStateKey,
  activeStateName,
  activeRoleId,
  formLogoKey,
  onSidebarNavClick,
  showValidationErrors,
  validationDescriptorsByPath,
  focusedFieldId,
  fieldErrorOverrides,
  previewFieldValues,
  customFields,
  previewApplication,
  activeLocale,
  footerSubmitScreen,
}: TranslationWorkspacePreviewAreaProps) => {
  const mergedPreviewFields = useMemo(
    () => mergePreviewFieldRegistry(customFields),
    [customFields],
  )

  if (previewScreens.length === 0) {
    return (
      <div className={styles.previewAreaBottomMargin}>
        <Box
          paddingTop={[3, 6, 10]}
          borderRadius="large"
          background="white"
          padding={[3, 5, 8]}
        >
          <Text color="dark300">
            Select a section from the states panel to preview.
          </Text>
        </Box>
      </div>
    )
  }

  const footerSubmitActions = footerSubmitScreen?.submitActions ?? []
  const showTemplateFooterButtons = footerSubmitActions.length > 0

  const resolveStepTitle = (
    title: string | null | undefined,
    titleMessageDescriptor:
      | (TemplateSectionNav['titleMessageDescriptor'] extends infer T ? T : never)
      | null
      | undefined,
  ) =>
    resolveTranslatableStaticText(
      title ?? '',
      titleMessageDescriptor ? [titleMessageDescriptor] : [],
      resolvePreviewString,
    )

  return (
    <div
      className={`${styles.previewAreaBottomMargin} ${styles.previewWrapper}`}
    >
      <div className={styles.previewFormColumn}>
        <Box
          paddingTop={[3, 6, 10]}
          height="full"
          borderRadius="large"
          background="white"
          className={styles.previewShell}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="spaceBetween"
            height="full"
          >
            <Box paddingX={[3, 5, 8]}>
              <Text variant="h2" as="h2" marginBottom={1}>
                {previewScreens[0]
                  ? resolveTranslatableStaticText(
                      previewScreens[0].title,
                      previewScreens[0].messageDescriptors,
                      resolvePreviewString,
                    )
                  : ''}
              </Text>
              <TranslationWorkspacePreviewShell
                activeLocale={activeLocale}
                previewScreens={previewScreens}
                previewFieldValues={previewFieldValues}
                resolvePreviewString={resolvePreviewString}
              >
                {previewScreens.map((screen) => (
                  <TranslationWorkspaceFieldPreview
                    key={screen.id}
                    screen={screen}
                    resolvePreviewString={resolvePreviewString}
                    formatMessage={formatMessage as PreviewFormatMessage}
                    showValidationErrors={showValidationErrors}
                    validationDescriptorsByPath={validationDescriptorsByPath}
                    focusedFieldId={focusedFieldId}
                    fieldErrorOverrides={fieldErrorOverrides}
                    previewFieldValues={previewFieldValues}
                    previewFields={mergedPreviewFields}
                    previewApplication={previewApplication}
                  />
                ))}
              </TranslationWorkspacePreviewShell>
            </Box>

            <Box
              marginTop={7}
              className={styles.previewFooter}
              paddingX={[3, 5, 8]}
              paddingTop={[1, 4]}
              display="flex"
              flexDirection="rowReverse"
              alignItems="center"
              justifyContent="spaceBetween"
            >
              <Box display="inlineFlex" padding={2} paddingRight="none">
                {showTemplateFooterButtons ? (
                  footerSubmitActions.map((action, idx) => {
                    const cfg =
                      SUBMIT_PREVIEW_BUTTON_MAP[action.buttonType] ??
                      SUBMIT_PREVIEW_BUTTON_MAP['primary']
                    const label = resolveSubmitActionLabel(
                      action,
                      resolvePreviewString,
                    )
                    return (
                      <Box
                        key={`${action.event}-${idx}`}
                        marginLeft={idx === 0 ? 0 : 2}
                      >
                        <Button
                          type="button"
                          variant={cfg.variant}
                          icon={cfg.icon}
                          colorScheme={cfg.colorScheme as any}
                        >
                          {label || formatMessage(coreMessages.buttonSubmit)}
                        </Button>
                      </Box>
                    )
                  })
                ) : (
                  <Button icon="arrowForward" type="button">
                    {formatMessage(coreMessages.buttonNext)}
                  </Button>
                )}
              </Box>
              <Box
                display={['none', 'inlineFlex']}
                padding={2}
                paddingLeft="none"
              >
                <Button variant="ghost" type="button">
                  {formatMessage(coreMessages.buttonBack)}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>

      <div className={styles.previewStepperColumn}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingTop={[0, 0, 8]}
        >
          <FormStepperV2
            sections={[
              <Box
                marginLeft={1}
                key="stepper-title"
                paddingBottom={[0, 0, 4]}
              >
                <Text variant="h4">
                  {activeFormTitle ?? templateName}
                </Text>
              </Box>,
              ...activeSections.map((section, i) => (
                <Box
                  key={section.id}
                  cursor="pointer"
                  onClick={() => {
                    const sectionData = section
                    const screens =
                      sectionData.screens as ScreenIntrospection[]
                    const firstSubSection = sectionData.subSections[0]
                    const location: SidebarNavLocation = {
                      stateKey: activeStateKey,
                      stateName: activeStateName,
                      roleId: activeRoleId,
                      sectionId: section.id,
                      sectionTitle: section.title,
                      ...(firstSubSection
                        ? {
                            subsectionId: firstSubSection.id,
                            subsectionTitle: firstSubSection.title,
                          }
                        : {}),
                    }
                    const navScreens = firstSubSection
                      ? (firstSubSection.screens as ScreenIntrospection[])
                      : screens
                    const nav = firstSubSection
                      ? buildSubSectionNavigationScreen(
                          firstSubSection.id,
                          firstSubSection.title,
                          firstSubSection.titleMessageDescriptor,
                          navScreens,
                        )
                      : buildSectionNavigationScreen(
                          section.id,
                          section.title,
                          section.titleMessageDescriptor,
                          navScreens,
                        )
                    onSidebarNavClick(nav, location)
                  }}
                >
                  <Section
                    section={resolveStepTitle(section.title, section.titleMessageDescriptor) || section.id}
                    sectionIndex={i}
                    isActive={selectedLocation?.sectionId === section.id}
                    isComplete={
                      activeSections.findIndex(
                        (s) => s.id === selectedLocation?.sectionId,
                      ) > i
                    }
                    subSections={
                      section.subSections.length > 1
                        ? section.subSections.map((sub) => (
                            <Box
                              key={sub.id}
                              cursor="pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                const subScreens =
                                  sub.screens as ScreenIntrospection[]
                                if (subScreens.length === 0) return
                                const nav = buildSubSectionNavigationScreen(
                                  sub.id,
                                  sub.title,
                                  sub.titleMessageDescriptor,
                                  subScreens,
                                )
                                onSidebarNavClick(nav, {
                                  stateKey: activeStateKey,
                                  stateName: activeStateName,
                                  roleId: activeRoleId,
                                  sectionId: section.id,
                                  sectionTitle: section.title,
                                  subsectionId: sub.id,
                                  subsectionTitle: sub.title,
                                })
                              }}
                            >
                              <Text
                                variant="medium"
                                fontWeight={
                                  selectedLocation?.subsectionId === sub.id
                                    ? 'semiBold'
                                    : 'regular'
                                }
                              >
                                {resolveStepTitle(sub.title, sub.titleMessageDescriptor) || sub.id}
                              </Text>
                            </Box>
                          ))
                        : undefined
                    }
                  />
                </Box>
              )),
            ]}
          />
          {formLogoKey ? (
            <Box
              display={['none', 'none', 'flex']}
              alignItems="center"
              justifyContent="center"
              paddingBottom={4}
            >
              <TranslationWorkspaceFormLogo logoKey={formLogoKey} />
            </Box>
          ) : null}
        </Box>
      </div>
    </div>
  )
}
