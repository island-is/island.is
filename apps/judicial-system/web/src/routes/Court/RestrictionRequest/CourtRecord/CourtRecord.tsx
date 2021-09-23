import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
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
  capitalize,
  caseTypes,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { AccusedPleaDecision, CaseType } from '@island.is/judicial-system/types'
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
  accusedRights,
  rcCourtRecord,
} from '@island.is/judicial-system-web/messages'
import * as styles from './CourtRecord.treat'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    courtRecordStartDateIsValid,
    setCourtRecordStartDateIsValid,
  ] = useState(true)
  const [courtAttendeesErrorMessage, setCourtAttendeesMessage] = useState('')
  const [courtLocationErrorMessage, setCourtLocationMessage] = useState('')
  const [prosecutorDemandsErrorMessage, setProsecutorDemandsMessage] = useState(
    '',
  )
  const [
    accusedPleaAnnouncementErrorMessage,
    setAccusedPleaAnnouncementMessage,
  ] = useState('')
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

      if (wc.registrar) {
        attendees += `${wc.registrar.name} ${wc.registrar.title}\n`
      }

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

      autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)

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

      setWorkingCase(theCase)
    }
  }, [workingCase, updateCase, setWorkingCase, data, autofill])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
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
              <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={8}>
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
                  required
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  data-testid="courtLocation"
                  name="courtLocation"
                  label={formatMessage(
                    rcCourtRecord.sections.courtLocation.label,
                  )}
                  defaultValue={workingCase.courtLocation}
                  placeholder={formatMessage(
                    rcCourtRecord.sections.courtLocation.placeholder,
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
              </Box>
              <Box marginBottom={3}>
                <Input
                  data-testid="courtAttendees"
                  name="courtAttendees"
                  label="Viðstaddir og hlutverk þeirra"
                  defaultValue={workingCase.courtAttendees}
                  placeholder="Skrifa hér..."
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'courtAttendees',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      courtAttendeesErrorMessage,
                      setCourtAttendeesMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'courtAttendees',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setCourtAttendeesMessage,
                    )
                  }
                  errorMessage={courtAttendeesErrorMessage}
                  hasError={courtAttendeesErrorMessage !== ''}
                  textarea
                  rows={7}
                  required
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
                  {`${formatMessage(accusedRights.title, {
                    accusedType: formatAccusedByGender(
                      workingCase.accusedGender,
                      NounCases.GENITIVE,
                    ),
                  })} `}
                  <Text as="span" fontWeight="semiBold" color="red600">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <HideableText
                  text={formatMessage(accusedRights.text)}
                  isHidden={workingCase.isAccusedAbsent}
                  onToggleVisibility={(isVisible: boolean) =>
                    setAndSendToServer(
                      'isAccusedAbsent',
                      isVisible,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                  tooltip={formatMessage(accusedRights.tooltip, {
                    accusedType: formatAccusedByGender(
                      workingCase.accusedGender,
                      NounCases.GENITIVE,
                    ),
                  })}
                />
              </Box>
              <BlueBox>
                <div className={styles.accusedPleaDecision}>
                  <RadioButton
                    name="accusedPleaDecision"
                    id="accused-plea-decision-rejecting"
                    label={formatMessage(
                      rcCourtRecord.sections.accusedAppealDecision.options
                        .reject,
                      {
                        accusedType: capitalize(
                          formatAccusedByGender(workingCase.accusedGender),
                        ),
                      },
                    )}
                    checked={
                      workingCase.accusedPleaDecision ===
                      AccusedPleaDecision.REJECT
                    }
                    onChange={() => {
                      setAndSendToServer(
                        'accusedPleaDecision',
                        AccusedPleaDecision.REJECT,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                  <RadioButton
                    name="accusedPleaDecision"
                    id="accused-plea-decision-accepting"
                    label={formatMessage(
                      rcCourtRecord.sections.accusedAppealDecision.options
                        .accept,
                      {
                        accusedType: capitalize(
                          formatAccusedByGender(workingCase.accusedGender),
                        ),
                      },
                    )}
                    checked={
                      workingCase.accusedPleaDecision ===
                      AccusedPleaDecision.ACCEPT
                    }
                    onChange={() => {
                      setAndSendToServer(
                        'accusedPleaDecision',
                        AccusedPleaDecision.ACCEPT,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                </div>
                <Input
                  data-testid="accusedPleaAnnouncement"
                  name="accusedPleaAnnouncement"
                  label={`Afstaða ${formatAccusedByGender(
                    workingCase.accusedGender,
                    NounCases.GENITIVE,
                  )}`}
                  defaultValue={workingCase.accusedPleaAnnouncement}
                  placeholder={formatMessage(
                    rcCourtRecord.sections.accusedPleaAnnouncement.placeholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'accusedPleaAnnouncement',
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                      accusedPleaAnnouncementErrorMessage,
                      setAccusedPleaAnnouncementMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'accusedPleaAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                      setAccusedPleaAnnouncementMessage,
                    )
                  }
                  errorMessage={accusedPleaAnnouncementErrorMessage}
                  hasError={accusedPleaAnnouncementErrorMessage !== ''}
                  textarea
                  rows={7}
                />
              </BlueBox>
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
                !validate(workingCase.courtAttendees ?? '', 'empty').isValid ||
                !validate(workingCase.prosecutorDemands ?? '', 'empty')
                  .isValid ||
                !validate(workingCase.litigationPresentations ?? '', 'empty')
                  .isValid ||
                !workingCase.accusedPleaDecision
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default CourtRecord
