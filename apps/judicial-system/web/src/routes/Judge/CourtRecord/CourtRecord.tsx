import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import {
  FormFooter,
  CourtDocuments,
  PageLayout,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
  DateTime,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  capitalize,
  caseTypes,
  formatAccusedByGender,
  formatProsecutorDemands,
  NounCases,
} from '@island.is/judicial-system/formatters'
import {
  AccusedPleaDecision,
  Case,
  CaseCustodyRestrictions,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
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
import { useRouter } from 'next/router'
import { validate } from '../../../utils/validate'
import * as styles from './CourtRecord.treat'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    courtRecordStartDateIsValid,
    setCourtRecordStartDateIsValid,
  ] = useState(true)
  const [courtAttendeesErrorMessage, setCourtAttendeesMessage] = useState('')
  const [policeDemandsErrorMessage, setPoliceDemandsMessage] = useState('')
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
        } ${formatAccusedByGender(wc?.accusedGender || CaseGender.OTHER)}`
      }

      if (wc.defenderName) {
        attendees += `\n${
          wc.defenderName
        } skipaður verjandi ${formatAccusedByGender(
          wc?.accusedGender || CaseGender.OTHER,
          NounCases.GENITIVE,
        )}`
      }

      return attendees
    }

    if (!workingCase && data?.case) {
      const theCase = data.case

      autofill('courtStartDate', new Date().toString(), theCase)

      autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)

      if (
        theCase.accusedName &&
        theCase.court &&
        theCase.requestedCustodyEndDate
        // Note that theCase.requestedCustodyRestrictions can be undefined
      ) {
        autofill(
          'policeDemands',
          `${formatProsecutorDemands(
            theCase.type,
            theCase.accusedNationalId,
            theCase.accusedName,
            theCase.court,
            theCase.requestedCustodyEndDate,
            theCase.requestedCustodyRestrictions?.includes(
              CaseCustodyRestrictions.ISOLATION,
            ) || false,
            theCase.parentCase !== undefined,
            theCase.parentCase?.decision,
          )}${
            theCase.otherDemands && theCase.otherDemands.length > 0
              ? `\n\n${theCase.otherDemands}`
              : ''
          }`,
          theCase,
        )
      }

      if (theCase.type === CaseType.CUSTODY) {
        autofill(
          'litigationPresentations',
          'Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi kærða ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að kærða verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að kærða verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
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
                data-testid="policeDemands"
                name="policeDemands"
                label="Krafa"
                defaultValue={workingCase.policeDemands}
                placeholder="Hvað hafði ákæruvaldið að segja?"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'policeDemands',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    policeDemandsErrorMessage,
                    setPoliceDemandsMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'policeDemands',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setPoliceDemandsMessage,
                  )
                }
                errorMessage={policeDemandsErrorMessage}
                hasError={policeDemandsErrorMessage !== ''}
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
                selectedCourtDocuments={workingCase.courtDocuments || []}
                onUpdateCase={updateCase}
                setWorkingCase={setWorkingCase}
                workingCase={workingCase}
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  {`Réttindi ${formatAccusedByGender(
                    workingCase.accusedGender || CaseGender.OTHER,
                    NounCases.GENITIVE,
                  )}`}{' '}
                  <Text as="span" fontWeight="semiBold" color="red600">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <Text>
                  Sakborningi er bent á að honum sé óskylt að svara spurningum
                  er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113.
                  gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um
                  sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr.
                  114. gr. sömu laga
                </Text>
              </Box>
              <BlueBox>
                <div className={styles.accusedPleaDecision}>
                  <RadioButton
                    name="accusedPleaDecision"
                    id="accused-plea-decision-accepting"
                    label={`${capitalize(
                      formatAccusedByGender(workingCase.accusedGender),
                    )} hafnar kröfunni`}
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
                    id="accused-plea-decision-rejecting"
                    label={`${capitalize(
                      formatAccusedByGender(workingCase.accusedGender),
                    )} samþykkir kröfuna`}
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
                    workingCase.accusedGender || CaseGender.OTHER,
                    NounCases.GENITIVE,
                  )}`}
                  defaultValue={workingCase.accusedPleaAnnouncement}
                  placeholder={`Hvað hafði ${formatAccusedByGender(
                    workingCase.accusedGender || CaseGender.OTHER,
                  )} að segja um kröfuna? Mótmælti eða samþykkti?`}
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
                !validate(workingCase.courtAttendees || '', 'empty').isValid ||
                !validate(workingCase.policeDemands || '', 'empty').isValid ||
                !validate(workingCase.litigationPresentations || '', 'empty')
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
