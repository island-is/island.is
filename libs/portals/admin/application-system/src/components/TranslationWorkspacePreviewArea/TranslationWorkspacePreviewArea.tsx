import type { FC } from 'react'
import type { Application } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  FormStepperV2,
  Section,
} from '@island.is/island-ui/core'
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
import { TranslationWorkspaceFieldPreview } from '../TranslationWorkspaceFieldPreview/TranslationWorkspaceFieldPreview'
import { TranslationWorkspaceFormLogo } from '../TranslationWorkspaceFormLogo/TranslationWorkspaceFormLogo'
import * as styles from './TranslationWorkspacePreviewArea.css'

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
  customFields?: Record<string, FC<any>>
  previewApplication: Application
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
}: TranslationWorkspacePreviewAreaProps) => {
  if (previewScreens.length === 0) {
    return (
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
    )
  }

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
    <div className={styles.previewWrapper}>
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
                  customFields={customFields}
                  previewApplication={previewApplication}
                />
              ))}
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
                <Button icon="arrowForward" type="button">
                  {formatMessage(coreMessages.buttonNext)}
                </Button>
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
