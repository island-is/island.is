import React, { useCallback, useContext, useState } from 'react'
import router from 'next/router'
import { useIntl } from 'react-intl'
import { applyCase } from 'beygla'

import {
  BlueBox,
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
import { Box, Input } from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import { isTrafficViolationStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

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
  const { updateCase, setAndSendCaseToServer } = useCase()
  const stepIsValid = isTrafficViolationStepValidIndictments(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )
  const [demandsErrorMessage, setDemandsErrorMessage] = useState<string>('')

  useDeb(workingCase, ['indictmentIntroduction', 'demands'])

  const initialize = useCallback(() => {
    let indictmentIntroductionAutofill = undefined

    if (workingCase.defendants && workingCase.defendants.length > 0) {
      indictmentIntroductionAutofill = [
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
    }

    setAndSendCaseToServer(
      [
        {
          indictmentIntroduction: indictmentIntroductionAutofill?.join(''),
          demands: formatMessage(strings.demandsAutofill),
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [workingCase, setAndSendCaseToServer, formatMessage, setWorkingCase])

  useOnceOn(isCaseUpToDate, initialize)

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
        <Box component="section" marginBottom={3}>
          <SectionHeading
            title={formatMessage(strings.indictmentIntroductionTitle)}
          />
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
            autoComplete="off"
            rows={10}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(strings.demandsTitle)} />
          <BlueBox>
            <Input
              name="demands"
              label={formatMessage(strings.demandsLabel)}
              placeholder={formatMessage(strings.demandsPlaceholder)}
              value={workingCase.demands || ''}
              errorMessage={demandsErrorMessage}
              hasError={demandsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  demandsErrorMessage,
                  setDemandsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setDemandsErrorMessage,
                )
              }
              textarea
              autoComplete="off"
              required
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </BlueBox>
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
