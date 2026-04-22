import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
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
} from '../../types/translationWorkspace'
import {
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
} from '../../utils/translationWorkspaceNavigation'
import { resolveTranslatableStaticText } from '../../utils/translationWorkspaceStaticText'
import { TranslationWorkspaceFieldPreview } from '../TranslationWorkspaceFieldPreview/TranslationWorkspaceFieldPreview'

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
  onSidebarNavClick: (
    nav: ScreenIntrospection,
    location: SidebarNavLocation,
  ) => void
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
  onSidebarNavClick,
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
          Select a section from the sidebar to preview.
        </Text>
      </Box>
    )
  }

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
        <Box
          paddingTop={[3, 6, 10]}
          height="full"
          borderRadius="large"
          background="white"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="spaceBetween"
            height="full"
          >
            <GridColumn
              span={['12/12', '12/12', '10/12', '7/9']}
              offset={['0', '0', '1/12', '1/9']}
            >
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
                />
              ))}
            </GridColumn>

            <Box
              paddingX={[3, 5, 12]}
              paddingBottom={5}
              paddingTop={3}
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
      </GridColumn>

      <GridColumn span={['12/12', '12/12', '3/12', '3/12']}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingTop={[0, 0, 8]}
          paddingLeft={[0, 0, 0, 4]}
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
                          navScreens,
                        )
                      : buildSectionNavigationScreen(
                          section.id,
                          section.title,
                          navScreens,
                        )
                    onSidebarNavClick(nav, location)
                  }}
                >
                  <Section
                    section={section.title ?? section.id}
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
                                {sub.title ?? sub.id}
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
        </Box>
      </GridColumn>
    </GridRow>
  )
}
