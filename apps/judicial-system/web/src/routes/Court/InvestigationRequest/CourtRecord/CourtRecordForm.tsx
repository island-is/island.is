import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  CaseNumbers,
  CourtDocuments,
  DateTime,
  FormContentContainer,
  FormFooter,
  HideableText,
} from '@island.is/judicial-system-web/src/shared-components'
import { AccusedPleaDecision } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  areAccusedRightsHidden,
  capitalize,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import {
  accusedRights,
  icCourtRecord,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './CourtRecord.treat'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const CourtRecordForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const [
    courtRecordStartDateIsValid,
    setCourtRecordStartDateIsValid,
  ] = useState(true)
  const [courtAttendeesEM, setCourtAttendeesEM] = useState('')
  const [prosecutorDemandsEM, setProsecutorDemandsEM] = useState('')
  const [
    accusedPleaAnnouncementErrorMessage,
    setAccusedPleaAnnouncementMessage,
  ] = useState('')
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')

  const { updateCase } = useCase()
  const validations: FormSettings = {
    courtAttendees: {
      validations: ['empty'],
    },
    prosecutorDemands: {
      validations: ['empty'],
    },
    litigationPresentations: {
      validations: ['empty'],
    },
  }
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )
  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
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
                  courtAttendeesEM,
                  setCourtAttendeesEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtAttendees',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtAttendeesEM,
                )
              }
              errorMessage={courtAttendeesEM}
              hasError={courtAttendeesEM !== ''}
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
                prosecutorDemandsEM,
                setProsecutorDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setProsecutorDemandsEM,
              )
            }
            errorMessage={prosecutorDemandsEM}
            hasError={prosecutorDemandsEM !== ''}
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
            title={`Krafa - ${capitalize(caseTypes[workingCase.type])}`}
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
              {formatMessage(accusedRights.title, {
                accusedType: 'varnaraðila',
              })}
            </Text>
          </Box>
          <Box marginBottom={2}>
            <HideableText
              text={formatMessage(accusedRights.text)}
              isHidden={areAccusedRightsHidden(
                workingCase.isAccusedAbsent,
                workingCase.sessionArrangements,
              )}
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
                accusedType: 'varnaraðila',
              })}
            />
          </Box>
          <BlueBox>
            <div className={styles.accusedPleaDecision}>
              <RadioButton
                name="accusedPleaDecision"
                id="accused-plea-decision-rejecting"
                label={formatMessage(
                  icCourtRecord.sections.accusedAppealDecision.options.reject,
                )}
                checked={
                  workingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
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
                  icCourtRecord.sections.accusedAppealDecision.options.accept,
                )}
                checked={
                  workingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
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
            <Box marginBottom={2}>
              <RadioButton
                name="accusedPleaDecision"
                id="accused-plea-decision-na"
                label={formatMessage(
                  icCourtRecord.sections.accusedAppealDecision.options
                    .notApplicable,
                )}
                checked={
                  workingCase.accusedPleaDecision ===
                  AccusedPleaDecision.NOT_APPLICABLE
                }
                onChange={() => {
                  setAndSendToServer(
                    'accusedPleaDecision',
                    AccusedPleaDecision.NOT_APPLICABLE,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </Box>
            <Input
              data-testid="accusedPleaAnnouncement"
              name="accusedPleaAnnouncement"
              label="Afstaða varnaraðila"
              defaultValue={workingCase.accusedPleaAnnouncement}
              placeholder={formatMessage(
                icCourtRecord.sections.accusedPleaAnnouncement.placeholder,
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
          previousUrl={`${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_RULING_STEP_ONE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={
            !isValid ||
            !courtRecordStartDateIsValid ||
            !workingCase.accusedPleaDecision
          }
        />
      </FormContentContainer>
    </>
  )
}

export default CourtRecordForm
