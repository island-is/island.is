import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  FormFooter,
  CourtDocuments,
  PageLayout,
  CaseInfo,
  BlueBox,
  FormContentContainer,
  DateTime,
  HideableText,
} from '@island.is/judicial-system-web/src/components'
import { caseTypes } from '@island.is/judicial-system/formatters'
import { CaseType, Gender } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  setAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  rcCourtRecord as m,
  closedCourt,
  core,
} from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import { isCourtRecordStepValidRC } from '../../../../utils/validate'

export const CourtRecord: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [courtLocationErrorMessage, setCourtLocationMessage] = useState('')
  const [
    sessionBookingsErrorMessage,
    setSessionBookingsErrorMessage,
  ] = useState('')

  const router = useRouter()
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()

  const id = router.query.id

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      const defaultCourtAttendees = (wc: Case): string => {
        let attendees = ''

        if (wc.prosecutor) {
          attendees += `${wc.prosecutor.name} ${wc.prosecutor.title}`
        }

        if (wc.defenderName) {
          attendees += `\n${wc.defenderName} skipaður verjandi ${formatMessage(
            core.accused,
            {
              suffix:
                wc.defendants &&
                wc.defendants.length > 0 &&
                wc.defendants[0].gender === Gender.FEMALE
                  ? 'u'
                  : 'a',
            },
          )}`
        }

        if (wc.translator) {
          attendees += `\n${wc.translator} túlkur`
        }

        if (wc.defendants && wc.defendants.length > 0) {
          attendees += `\n${wc.defendants[0].name} ${formatMessage(
            core.accused,
            {
              suffix: wc.defendants[0].gender === Gender.MALE ? 'i' : 'a',
            },
          )}`
        }

        return attendees
      }

      const theCase = workingCase

      if (theCase.courtDate) {
        autofill('courtStartDate', theCase.courtDate, theCase)
      }

      if (theCase.court) {
        autofill(
          'courtLocation',
          `í ${
            theCase.court.name.indexOf('dómur') > -1
              ? theCase.court.name.replace('dómur', 'dómi')
              : theCase.court.name
          }`,
          theCase,
        )
      }

      if (theCase.courtAttendees !== '') {
        autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)
      }

      let autofillSessionBookings = ''

      if (theCase.defenderName) {
        autofillSessionBookings += `${formatMessage(
          m.sections.sessionBookings.autofillDefender,
          {
            defender: theCase.defenderName,
          },
        )}\n\n`
      }

      if (theCase.translator) {
        autofillSessionBookings += `${formatMessage(
          m.sections.sessionBookings.autofillTranslator,
          {
            translator: theCase.translator,
          },
        )}\n\n`
      }

      autofillSessionBookings += `${formatMessage(
        m.sections.sessionBookings.autofillRightToRemainSilent,
      )}\n\n${formatMessage(
        m.sections.sessionBookings.autofillCourtDocumentOne,
      )}\n\n${formatMessage(m.sections.sessionBookings.autofillAccusedPlea)}`

      if (theCase.type === CaseType.CUSTODY) {
        autofillSessionBookings += `\n\n${formatMessage(
          m.sections.sessionBookings.autofillPresentations,
          {
            accused: formatMessage(core.accused, {
              suffix:
                theCase.defendants &&
                theCase.defendants.length > 0 &&
                theCase.defendants[0].gender === Gender.FEMALE
                  ? 'u'
                  : 'a',
            }),
          },
        )}`
      }

      autofill('sessionBookings', autofillSessionBookings, theCase)

      setWorkingCase(theCase)
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Þingbók
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
              <DateTime
                name="courtStartDate"
                datepickerLabel="Dagsetning þinghalds"
                timeLabel="Þinghald hófst (kk:mm)"
                maxDate={new Date()}
                selectedDate={workingCase.courtStartDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  setAndSendDateToServer(
                    'courtStartDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                blueBox={false}
                required
              />
            </Box>
            <Input
              data-testid="courtLocation"
              name="courtLocation"
              tooltip={formatMessage(m.sections.courtLocation.tooltip)}
              label={formatMessage(m.sections.courtLocation.label)}
              value={workingCase.courtLocation || ''}
              placeholder={formatMessage(m.sections.courtLocation.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLocationErrorMessage,
                  setCourtLocationMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLocationMessage,
                )
              }
              errorMessage={courtLocationErrorMessage}
              hasError={courtLocationErrorMessage !== ''}
              autoComplete="off"
              required
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <HideableText
              text={formatMessage(closedCourt.text)}
              isHidden={workingCase.isClosedCourtHidden}
              onToggleVisibility={(isVisible: boolean) =>
                setAndSendToServer(
                  'isClosedCourtHidden',
                  isVisible,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              tooltip={formatMessage(closedCourt.tooltip)}
            />
          </Box>
          <Input
            data-testid="courtAttendees"
            name="courtAttendees"
            label="Mættir eru"
            value={workingCase.courtAttendees || ''}
            placeholder="Skrifa hér..."
            onChange={(event) =>
              removeTabsValidateAndSet(
                'courtAttendees',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              updateCase(
                workingCase.id,
                parseString('courtAttendees', event.target.value),
              )
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómskjöl
            </Text>
          </Box>
          <CourtDocuments
            title={`Krafa um ${caseTypes[workingCase.type]}`}
            tagText="Þingmerkt nr. 1"
            tagVariant="darkerBlue"
            text="Rannsóknargögn málsins liggja frammi."
            caseId={workingCase.id}
            selectedCourtDocuments={workingCase.courtDocuments ?? []}
            onUpdateCase={updateCase}
            setWorkingCase={setWorkingCase}
            workingCase={workingCase}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.sessionBookings.title)} `}
              <Tooltip
                text={formatMessage(m.sections.sessionBookings.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="sessionBookings"
              name="sessionBookings"
              label={formatMessage(m.sections.sessionBookings.label)}
              value={workingCase.sessionBookings || ''}
              placeholder={formatMessage(
                m.sections.sessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  sessionBookingsErrorMessage,
                  setSessionBookingsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setSessionBookingsErrorMessage,
                )
              }
              errorMessage={sessionBookingsErrorMessage}
              hasError={sessionBookingsErrorMessage !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${id}`}
          nextIsDisabled={!isCourtRecordStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
