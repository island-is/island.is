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
    onAnswerChange,
    nextPage,
    prevPage,
    submit,
    dispatch,
  } = useFormActions(applicationId, initialScreen)

  const { setInfo } = useHeaderInfo()

  const displayValues = useDisplayRecompute(
    applicationId,
    screen.page.components,
    answers.current,
    screen.locale ?? 'is',
  )

  React.useEffect(() => {
    if (screen.header.applicationName || screen.header.title) {
      setInfo({
        institutionName: screen.header.institutionName ?? undefined,
        applicationName: screen.header.applicationName ?? screen.header.title,
      })
    }
  }, [screen.header.applicationName, screen.header.institutionName, screen.header.title, setInfo])

  return (
    <ApplicationContextProvider applicationId={applicationId}>
      <Box className={styles.root}>
        <Box paddingTop={[0, 4]} paddingBottom={[0, 5]} width="full" height="full">
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
                        <Text marginBottom={3}>{screen.header.description}</Text>
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
                          <Box display="inlineFlex" padding={2} paddingRight="none">
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
                                    btn.variant === 'REJECT' ? 'ghost' : 'primary'
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
                          <Box display={['none', 'inlineFlex']} padding={2} paddingLeft="none">
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
                          <Box display={['inlineFlex', 'none']} padding={2} paddingLeft="none">
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
                                    screen.stepper.activeSectionIndex === idx &&
                                    screen.stepper.activeSubSectionIndex === subIdx
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
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ApplicationContextProvider>
  )
}
