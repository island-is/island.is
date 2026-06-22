'use client'

import React from 'react'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  FormStepperV2,
  Section,
  Text,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import * as institutionLogos from '@island.is/application/assets/institution-logos'

import { useFormActions } from '../hooks/useFormActions'
import { useDisplayRecompute } from '../hooks/useDisplayRecompute'
import { FormRenderer } from './FormRenderer'
import { useHeaderInfo } from './HeaderInfoProvider'
import { ApplicationContextProvider } from './ApplicationContext'
import type { SdfScreen } from '../lib/graphql'
import * as styles from './ApplicationShell.css'

interface ApplicationShellProps {
  applicationId: string
  initialScreen: SdfScreen
}

export const ApplicationShell = ({
  applicationId,
  initialScreen,
}: ApplicationShellProps) => {
  const {
    screen,
    isPending,
    error,
    pendingRefetchTargets,
    answers,
    answerSnapshot,
    onAnswerChange,
    nextPage,
    prevPage,
    submit,
    dispatch,
  } = useFormActions(applicationId, initialScreen)

  const { setInfo } = useHeaderInfo()

  React.useEffect(() => {
    const titleParts = [
      `${screen.header.applicationName ?? screen.header.title} | Ísland.is`,
    ]
    if (screen.header.applicationName && screen.header.title) {
      titleParts.unshift(screen.header.title)
    }
    document.title = titleParts.join(' - ')
  }, [screen.header.title, screen.header.applicationName])

  // Logos travel as a serializable export name (e.g. "HmsLogo"); resolve it back
  // to the SVG component from the institution-logos barrel, guarding unknown keys.
  const logoKey = screen.header.logo
  const FormLogo =
    logoKey && logoKey in institutionLogos
      ? (institutionLogos as unknown as Record<string, React.ComponentType>)[logoKey]
      : undefined

  const displayValues = useDisplayRecompute(
    applicationId,
    screen.page.components,
    answerSnapshot,
    screen.locale ?? 'is',
    screen.page.index,
  )

  React.useEffect(() => {
    if (screen.header.applicationName || screen.header.title) {
      setInfo({
        institutionName: screen.header.institutionName ?? undefined,
        applicationName: screen.header.applicationName ?? screen.header.title,
      })
    }
  }, [
    screen.header.applicationName,
    screen.header.institutionName,
    screen.header.title,
    setInfo,
  ])

  return (
    <ApplicationContextProvider applicationId={applicationId}>
      <Box className={styles.root}>
        <Box
          paddingTop={[0, 4]}
          paddingBottom={[0, 5]}
          width="full"
          height="full"
        >
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '9/12', '9/12']}
                className={styles.shellContainer}
              >
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
                        {screen.header.title}
                      </Text>
                      {screen.header.description && (
                        <Box marginBottom={3}>
                          <Markdown>{screen.header.description}</Markdown>
                        </Box>
                      )}

                      {error && (
                        <Box marginBottom={3}>
                          <AlertMessage type="error" title={error} />
                        </Box>
                      )}

                      <Box>
                        <FormRenderer
                          components={screen.page.components}
                          errors={screen.page.errors}
                          answers={answers.current}
                          onAnswerChange={onAnswerChange}
                          dispatch={dispatch}
                          displayValues={displayValues}
                          pendingRefetchTargets={pendingRefetchTargets}
                        />
                      </Box>
                    </GridColumn>

                    <Box marginTop={7} className={styles.buttonContainer}>
                      <GridColumn
                        span={['12/12', '12/12', '10/12', '7/9']}
                        offset={['0', '0', '1/12', '1/9']}
                      >
                        <Box
                          display="flex"
                          flexDirection="rowReverse"
                          alignItems="center"
                          justifyContent="spaceBetween"
                          paddingTop={[1, 4]}
                        >
                          <Box
                            display="inlineFlex"
                            padding={2}
                            paddingRight="none"
                          >
                            {screen.footer.buttons.map((btn) => (
                              <Box key={btn.id} marginLeft={1}>
                                <Button
                                  loading={isPending}
                                  icon={
                                    btn.actionType === 'NEXT_PAGE'
                                      ? 'arrowForward'
                                      : btn.actionType === 'SUBMIT'
                                      ? 'checkmarkCircle'
                                      : undefined
                                  }
                                  variant={
                                    btn.variant === 'REJECT'
                                      ? 'ghost'
                                      : 'primary'
                                  }
                                  colorScheme={
                                    btn.variant === 'REJECT'
                                      ? 'destructive'
                                      : 'default'
                                  }
                                  onClick={() => {
                                    if (btn.actionType === 'SUBMIT') {
                                      submit(btn.id)
                                    } else if (btn.actionType === 'NEXT_PAGE') {
                                      nextPage()
                                    }
                                  }}
                                >
                                  {btn.text}
                                </Button>
                              </Box>
                            ))}
                          </Box>
                          <Box
                            display={['none', 'inlineFlex']}
                            padding={2}
                            paddingLeft="none"
                          >
                            {screen.footer.canGoBack && (
                              <Button
                                variant="ghost"
                                onClick={prevPage}
                                disabled={isPending}
                              >
                                Til baka
                              </Button>
                            )}
                          </Box>
                          <Box
                            display={['inlineFlex', 'none']}
                            padding={2}
                            paddingLeft="none"
                          >
                            {screen.footer.canGoBack && (
                              <Button
                                circle
                                variant="ghost"
                                icon="arrowBack"
                                onClick={prevPage}
                                disabled={isPending}
                              />
                            )}
                          </Box>
                        </Box>
                      </GridColumn>
                    </Box>
                  </Box>
                </Box>
              </GridColumn>

              <GridColumn
                span={['12/12', '12/12', '3/12', '3/12']}
                className={styles.sidebarContainer}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="spaceBetween"
                  height="full"
                  paddingTop={[0, 0, 8]}
                  paddingLeft={[0, 0, 0, 4]}
                  className={styles.sidebarInner}
                >
                  {screen.stepper.sections.length > 0 ? (
                    <FormStepperV2
                      sections={screen.stepper.sections.map((section, idx) => (
                        <Section
                          key={section.id}
                          section={section.title}
                          sectionIndex={idx}
                          isActive={screen.stepper.activeSectionIndex === idx}
                          isComplete={section.isComplete}
                          subSections={
                            section.children.length > 1
                              ? section.children.map((sub, subIdx) => (
                                  <Text
                                    key={sub.id}
                                    variant="medium"
                                    fontWeight={
                                      screen.stepper.activeSectionIndex ===
                                        idx &&
                                      screen.stepper.activeSubSectionIndex ===
                                        subIdx
                                        ? 'semiBold'
                                        : 'regular'
                                    }
                                  >
                                    {sub.title}
                                  </Text>
                                ))
                              : undefined
                          }
                        />
                      ))}
                    />
                  ) : (
                    // Forms without a stepper (e.g. the NOT_STARTED prerequisites
                    // form) still need a top slot so `justifyContent="spaceBetween"`
                    // keeps the logo anchored to the bottom of the sidebar, mirroring
                    // the legacy FormShell which always renders the stepper container.
                    <Box />
                  )}
                  {FormLogo && (
                    <Box
                      display={['none', 'none', 'flex']}
                      alignItems="center"
                      justifyContent="center"
                      marginRight={[0, 0, 0, 4]}
                      paddingBottom={4}
                    >
                      <FormLogo />
                    </Box>
                  )}
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ApplicationContextProvider>
  )
}
