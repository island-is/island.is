import React, { useCallback, useContext, useEffect } from 'react'
import router from 'next/router'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'

import { Box, Input, Button } from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'
import useIndictmentCounts from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { IndictmentCount as TIndictmentCount } from '@island.is/judicial-system-web/src/graphql/schema'

import { IndictmentCount } from './IndictmentCount'
import { indictment as strings } from './Indictment.strings'

const Indictment: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()

  const {
    createIndictmentCount,
    updateIndictmentCount,
    deleteIndictmentCount,
  } = useIndictmentCounts()

  const stepIsValid = true

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )
  useDeb(workingCase, ['indictmentIntroduction'])

  const handleCreateIndictmentCount = useCallback(async () => {
    const indictmentCount = await createIndictmentCount(workingCase.id)

    if (!indictmentCount) {
      return
    }

    setWorkingCase((theCase) => ({
      ...theCase,
      indictmentCounts: theCase.indictmentCounts
        ? [...theCase.indictmentCounts, indictmentCount]
        : [indictmentCount],
    }))
  }, [createIndictmentCount, setWorkingCase, workingCase.id])

  useEffect(() => {
    if (isCaseUpToDate && workingCase.indictmentCounts?.length === 0) {
      handleCreateIndictmentCount()
    }
  }, [
    isCaseUpToDate,
    handleCreateIndictmentCount,
    workingCase.indictmentCounts,
  ])

  const updateIndictmentCountState = useCallback(
    (indictmentCountId: string, update: TIndictmentCount) => {
      setWorkingCase((theCase) => {
        if (!theCase.indictmentCounts) {
          return theCase
        }

        const indictmentCountIndexToUpdate = theCase.indictmentCounts.findIndex(
          (indictmentCount) => indictmentCount.id === indictmentCountId,
        )

        const newIndictmentCounts = [...theCase.indictmentCounts]

        newIndictmentCounts[indictmentCountIndexToUpdate] = {
          ...newIndictmentCounts[indictmentCountIndexToUpdate],
          ...update,
        }
        return { ...theCase, indictmentCounts: newIndictmentCounts }
      })
    },
    [setWorkingCase],
  )

  const handleUpdateIndictmentCount = useCallback(
    async (
      indictmentCountId: string,
      updatedIndictmentCount: TIndictmentCount,
    ) => {
      updateIndictmentCount(workingCase.id, updatedIndictmentCount)
      updateIndictmentCountState(indictmentCountId, updatedIndictmentCount)
    },
    [updateIndictmentCount, updateIndictmentCountState, workingCase.id],
  )

  const handleDeleteIndictmentCount = async (indictmentCountId: string) => {
    if (
      workingCase.indictmentCounts &&
      workingCase.indictmentCounts.length > 1
    ) {
      await deleteIndictmentCount(workingCase.id, indictmentCountId)

      setWorkingCase((theCase) => ({
        ...theCase,
        indictmentCounts: theCase.indictmentCounts?.filter(
          (count) => count.id !== indictmentCountId,
        ),
      }))
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.INDICTMENT}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.indictment)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <Box marginBottom={5}>
          <Input
            name="indictmentsIntroduction"
            label={formatMessage(strings.sections.introduction.label)}
            placeholder={formatMessage(
              strings.sections.introduction.placeholder,
            )}
            value={workingCase.indictmentIntroduction || ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'indictmentIntroduction',
                event.target.value,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'indictmentIntroduction',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        {workingCase.indictmentCounts?.map((indictmentCount, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Box
              component="section"
              marginBottom={
                index - 1 === workingCase.indictmentCounts?.length ? 0 : 3
              }
            >
              <SectionHeading
                title={formatMessage(strings.sections.indictmentCount.heading, {
                  count: index + 1,
                })}
              />
              <AnimatePresence>
                <IndictmentCount
                  indictmentCount={indictmentCount}
                  workingCase={workingCase}
                  onDelete={index > 0 ? handleDeleteIndictmentCount : undefined}
                  onChange={handleUpdateIndictmentCount}
                ></IndictmentCount>
              </AnimatePresence>
            </Box>
          </motion.div>
        ))}
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            variant="ghost"
            icon="add"
            onClick={handleCreateIndictmentCount}
            disabled={false}
          >
            {formatMessage(strings.sections.indictmentCount.addCount)}
          </Button>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_PROCESSING_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_CASE_FILES_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Indictment
