import React, { useCallback, useContext, useEffect } from 'react'
import router from 'next/router'
import { useIntl } from 'react-intl'
import { applyCase } from 'beygla'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box, Input } from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { indictment as strings } from './Indictment.strings'
import { formatNationalId } from '@island.is/judicial-system/formatters'

const Indictment: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const stepIsValid = true
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  useDeb(workingCase, 'indictmentIntroduction')

  useEffect(() => {
    if (
      isCaseUpToDate &&
      workingCase.defendants &&
      workingCase.defendants.length > 0
    ) {
      const indictmentIntroductionAutofill = [
        workingCase.prosecutor?.institution?.name.toUpperCase(),
        `\n\n${formatMessage(strings.indictmentIntroductionAutofillAnnounces)}`,
        `\n\n${formatMessage(strings.indictmentIntroductionAutofillCourt, {
          court: workingCase.court?.name?.replace('dómur', 'dómi'),
        })}`,
        `\n\n${formatMessage(strings.indictmentIntroductionAutofillDefendant, {
          defendantName: workingCase.defendants[0].name
            ? applyCase('þgf', workingCase.defendants[0].name)
            : 'Ekki skráð',
          defendantNationalId: workingCase.defendants[0].nationalId
            ? formatNationalId(workingCase.defendants[0].nationalId)
            : 'Ekki skráð',
        })}`,
        `\n\n${workingCase.defendants[0].address}`,
      ]

      setAndSendCaseToServer(
        [
          {
            indictmentIntroduction: indictmentIntroductionAutofill.join(''),
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [
    formatMessage,
    isCaseUpToDate,
    setAndSendCaseToServer,
    setWorkingCase,
    workingCase,
  ])

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
            label={formatMessage(strings.indictmentIntroductionLabel)}
            placeholder={formatMessage(
              strings.indictmentIntroductionPlaceholder,
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
            rows={10}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
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
