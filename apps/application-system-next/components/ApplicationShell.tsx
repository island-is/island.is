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
import { FormRenderer } from './FormRenderer'
import { useHeaderInfo } from './HeaderInfoProvider'
import type { SdfScreen } from '../lib/graphql'
import * as styles from './ApplicationShell.css'

interface ApplicationShellProps {
  applicationId: string
  initialScreen: SdfScreen
}

export function ApplicationShell({
  applicationId,
  initialScreen,
}: ApplicationShellProps) {
  const {
    screen,
    isPending,
    error,
    answers,
    onAnswerChange,
    nextPage,
    prevPage,
    submit,
  } = useFormActions(applicationId, initialScreen)

  const { setInfo } = useHeaderInfo()

  React.useEffect(() => {
    if (screen.header.title) {
      setInfo({
        institutionName: screen.header.description ?? undefined,
        applicationName: screen.header.title,
      })
    }
  }, [screen.header.title, screen.header.description, setInfo])

  return (
    <Box className={styles.root}>
      <Box paddingTop={[0, 4]} paddingBottom={[0, 5]} width="full" height="full">
        <GridContainer>
          <GridRow>
            {/* Main content — 9/12 on desktop */}
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
                {/* Screen header */}
                <GridColumn
                  span={['12/12', '12/12', '10/12', '7/9']}
                  offset={['0', '0', '1/12', '1/9']}
                >
                  <Text variant="h1" marginBottom={1}>
                    {screen.header.title}
                  </Text>
                  {screen.header.description && (
                    <Text marginBottom={3}>{screen.header.description}</Text>
                  )}
                </GridColumn>

                {/* Error banner */}
                {error && (
                  <GridColumn
                    span={['12/12', '12/12', '10/12', '7/9']}
                    offset={['0', '0', '1/12', '1/9']}
                  >
                    <Box marginBottom={3}>
                      <AlertMessage type="error" title={error} />
                    </Box>
                  </GridColumn>
                )}

                {/* Form fields */}
                <GridColumn
                  span={['12/12', '12/12', '10/12', '7/9']}
                  offset={['0', '0', '1/12', '1/9']}
                >
                  <FormRenderer
                    components={screen.page.components}
                    errors={screen.page.errors}
                    answers={answers.current}
                    onAnswerChange={onAnswerChange}
                  />
                </GridColumn>

                {/* Footer */}
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
                      {screen.footer.canGoBack && (
                        <>
                          <Box
                            display={['none', 'inlineFlex']}
                            padding={2}
                            paddingLeft="none"
                          >
                            <Button
                              variant="ghost"
                              onClick={prevPage}
                              disabled={isPending}
                            >
                              Til baka
                            </Button>
                          </Box>
                          <Box
                            display={['inlineFlex', 'none']}
                            padding={2}
                            paddingLeft="none"
                          >
                            <Button
                              circle
                              variant="ghost"
                              icon="arrowBack"
                              onClick={prevPage}
                              disabled={isPending}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                  </GridColumn>
                </Box>
              </Box>
            </GridColumn>

            {/* Sidebar — 3/12 on desktop */}
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
  )
}
