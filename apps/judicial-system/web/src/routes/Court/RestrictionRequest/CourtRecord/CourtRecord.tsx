import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  FormFooter,
  CourtDocuments,
  PageLayout,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
  DateTime,
  HideableText,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  caseTypes,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '../../../../utils/validate'
import {
  rcCourtRecord as m,
  closedCourt,
} from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    courtRecordStartDateIsValid,
    setCourtRecordStartDateIsValid,
  ] = useState(true)
  const [courtLocationErrorMessage, setCourtLocationMessage] = useState('')
  const [prosecutorDemandsErrorMessage, setProsecutorDemandsMessage] = useState(
    '',
  )
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')

  const router = useRouter()
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()

  const id = router.query.id
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const defaultCourtAttendees = (wc: Case): string => {
      let attendees = ''

      if (wc.prosecutor && wc.accusedName) {
        attendees += `${wc.prosecutor.name} ${wc.prosecutor.title}\n${
          wc.accusedName
        } ${formatAccusedByGender(wc?.accusedGender)}`
      }

      if (wc.defenderName) {
        attendees += `\n${
          wc.defenderName
        } skipaður verjandi ${formatAccusedByGender(
          wc?.accusedGender,
          NounCases.GENITIVE,
        )}`
      }

      if (wc.translator) {
        attendees += `\n${wc.translator} túlkur`
      }

      return attendees
    }

    if (!workingCase && data?.case) {
      const theCase = data.case

      autofill('courtStartDate', new Date().toString(), theCase)

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

      if (theCase.demands) {
        autofill('prosecutorDemands', theCase.demands, theCase)
      }

      if (theCase.type === CaseType.CUSTODY) {
        autofill(
          'litigationPresentations',
          `Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi ${formatAccusedByGender(
            theCase.accusedGender,
            NounCases.GENITIVE,
          )} ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að ${formatAccusedByGender(
            theCase.accusedGender,
            NounCases.DATIVE,
          )} verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að ${formatAccusedByGender(
            theCase.accusedGender,
            NounCases.DATIVE,
          )} verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.`,
          theCase,
        )
      }

      autofill(
        'accusedBookings',
        `${formatMessage(
          m.sections.accusedBookings.autofillRightToRemainSilent,
        )}\n\n${formatMessage(
          m.sections.accusedBookings.autofillCourtDocumentOne,
        )}\n\n${formatMessage(m.sections.accusedBookings.autofillAccusedPlea)}`,
        theCase,
      )

      setWorkingCase(theCase)
    }
  }, [workingCase, updateCase, setWorkingCase, data, autofill, formatMessage])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Þingbók
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={3}>
              <BlueBox>
                <Box marginBottom={3}>
                  <DateTime
                    name="courtStartDate"
                    datepickerLabel="Dagsetning þinghalds"
                    timeLabel="Þinghald hófst (kk:mm)"
                    maxDate={new Date()}
                    selectedDate={
                      workingCase.courtStartDate
                        ? new Date(workingCase.courtStartDate)
                        : new Date()
                    }
                    onChange={(date: Date | undefined, valid: boolean) => {
                      newSetAndSendDateToServer(
                        'courtStartDate',
                        date,
                        valid,
                        workingCase,
                        setWorkingCase,
                        setCourtRecordStartDateIsValid,
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
                  defaultValue={workingCase.courtLocation}
                  placeholder={formatMessage(
                    m.sections.courtLocation.placeholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'courtLocation',
                      event,
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
              <Box marginBottom={3}>
                <Input
                  data-testid="courtAttendees"
                  name="courtAttendees"
                  label="Mættir eru"
                  defaultValue={workingCase.courtAttendees}
                  placeholder="Skrifa hér..."
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'courtAttendees',
                      event,
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
                />
              </Box>
              <Input
                data-testid="prosecutorDemands"
                name="prosecutorDemands"
                label="Krafa"
                defaultValue={workingCase.prosecutorDemands}
                placeholder="Hvað hafði ákæruvaldið að segja?"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'prosecutorDemands',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    prosecutorDemandsErrorMessage,
                    setProsecutorDemandsMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'prosecutorDemands',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setProsecutorDemandsMessage,
                  )
                }
                errorMessage={prosecutorDemandsErrorMessage}
                hasError={prosecutorDemandsErrorMessage !== ''}
                textarea
                rows={7}
                required
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
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  {`${formatMessage(m.sections.accusedBookings.title, {
                    genderedAccused: formatAccusedByGender(
                      workingCase.accusedGender,
                      NounCases.GENITIVE,
                    ),
                  })} `}
                  <Tooltip
                    text={formatMessage(m.sections.accusedBookings.tooltip)}
                  />
                </Text>
              </Box>
              <Input
                data-testid="accusedBookings"
                name="accusedBookings"
                label={formatMessage(m.sections.accusedBookings.label, {
                  genderedAccused: formatAccusedByGender(
                    workingCase.accusedGender,
                    NounCases.GENITIVE,
                  ),
                })}
                defaultValue={workingCase.accusedBookings}
                placeholder={formatMessage(
                  m.sections.accusedBookings.placeholder,
                )}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedBookings',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedBookings',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Málflutningur
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Input
                  data-testid="litigationPresentations"
                  name="litigationPresentations"
                  label="Málflutningur og aðrar bókanir"
                  defaultValue={workingCase.litigationPresentations}
                  placeholder="Málflutningsræður og annað sem fram kom í þinghaldi er skráð hér..."
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'litigationPresentations',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      litigationPresentationsErrorMessage,
                      setLitigationPresentationsMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'litigationPresentations',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setLitigationPresentationsMessage,
                    )
                  }
                  errorMessage={litigationPresentationsErrorMessage}
                  hasError={litigationPresentationsErrorMessage !== ''}
                  textarea
                  rows={7}
                  required
                />
              </Box>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${id}`}
              nextIsDisabled={
                !courtRecordStartDateIsValid ||
                !validate(workingCase.courtLocation ?? '', 'empty').isValid ||
                !validate(workingCase.prosecutorDemands ?? '', 'empty')
                  .isValid ||
                !validate(workingCase.litigationPresentations ?? '', 'empty')
                  .isValid
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default CourtRecord
