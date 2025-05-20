import { FC, useCallback, useContext, useState } from 'react'

import {
  Case,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  BlueBox,
  UserContext,
} from '@island.is/judicial-system-web/src/components'

import Modal from '../Modal/Modal'
import { hasDateChanged } from '@island.is/judicial-system-web/src/utils/formHelper'
import formatISO from 'date-fns/formatISO'
import { IntlShape, useIntl } from 'react-intl'
import { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'

interface Props {
  workingCase: Case
  onSubmit: (updateCase: UpdateCase) => Promise<boolean>
}

interface DateTime {
  value?: Date
  isValid: boolean
}

const isCaseModificationInvalid = (
  validToDateChanged: boolean,
  isolationToDateChanged: boolean,
  caseModifiedExplanation?: string,
  modifiedValidToDate?: DateTime,
  isCustodyIsolation?: boolean | null,
  modifiedIsolationToDate?: DateTime,
): boolean =>
  !caseModifiedExplanation ||
  !caseModifiedExplanation.trim() ||
  !modifiedValidToDate?.isValid ||
  (isCustodyIsolation && !modifiedIsolationToDate?.isValid) ||
  (!validToDateChanged && !isolationToDateChanged)

const getTitle = (type?: CaseType | null): string => {
  switch (type) {
    case CaseType.ADMISSION_TO_FACILITY:
      return 'Breyting á lengd vistunar'
    case CaseType.TRAVEL_BAN:
      return 'Breyting á lengd farbanns'
    case CaseType.CUSTODY:
      return 'Breyting á lengd gæsluvarðhalds'
    default:
      // Should never happen
      return ''
  }
}

const getText = (type?: CaseType | null): string => {
  switch (type) {
    case CaseType.ADMISSION_TO_FACILITY:
      return 'Hafi vistun eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd vistunar. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.'
    case CaseType.TRAVEL_BAN:
    case CaseType.CUSTODY:
      return 'Hafi gæsluvarðhaldi eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd gæsluvarðhalds. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.'
    default:
      // Should never happen
      return ''
  }
}

export const createCaseModifiedExplanation = (
  formatMessage: IntlShape['formatMessage'],
  previousExplaination: string | null | undefined,
  nextExplanation: string,
  userName?: string | null,
  userTitle?: string | null,
  institutionName?: string | null,
): string => {
  const now = new Date()
  const history = previousExplaination
    ? `${previousExplaination}<br/><br/>`
    : ''
  const date = capitalize(formatDate(now, 'PPPP', true))
  const time = formatDate(now, TIME_FORMAT)

  const entry = `${date} kl. ${time} - ${userName || ''} ${lowercase(
    userTitle,
  )}, ${institutionName || ''}<br/>Ástæða: ${nextExplanation}`

  return `${history}${entry}`
}

const ModifyDatesModal: FC<Props> = (props) => {
  const { workingCase, onSubmit } = props

  const [modifiedValidToDate, setModifiedValidToDate] = useState<DateTime>()
  const [modifiedIsolationToDate, setModifiedIsolationToDate] =
    useState<DateTime>()
  const [caseModifiedExplanation, setCaseModifiedExplanation] =
    useState<string>()
  const { user } = useContext(UserContext)

  const { formatMessage } = useIntl()

  const handleDateModification = useCallback(async () => {
    let formattedIsolationToDate = undefined

    if (!caseModifiedExplanation) return

    if (!modifiedValidToDate?.value) return

    if (
      workingCase.type &&
      [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY].includes(
        workingCase.type,
      )
    ) {
      if (!modifiedIsolationToDate?.value) {
        return
      } else {
        formattedIsolationToDate = formatISO(modifiedIsolationToDate.value, {
          representation: 'complete',
        })
      }
    }

    const formattedValidToDate = formatISO(modifiedValidToDate.value, {
      representation: 'complete',
    })

    const update = {
      validToDate: formattedValidToDate,
      ...(formattedIsolationToDate !== undefined && {
        isolationToDate: formattedIsolationToDate,
      }),
      caseModifiedExplanation: createCaseModifiedExplanation(
        formatMessage,
        workingCase.caseModifiedExplanation,
        caseModifiedExplanation,
        user?.name,
        user?.title,
        user?.institution?.name,
      ),
    }

    const updated = await onSubmit(update)

    if (updated) {
      setSuccessText(modificationSuccessText)
    }
  }, [
    caseModifiedExplanation,
    modifiedValidToDate?.value,
    workingCase.type,
    workingCase.caseModifiedExplanation,
    formatMessage,
    user?.name,
    user?.title,
    user?.institution?.name,
    onSubmit,
    modifiedIsolationToDate?.value,
    modificationSuccessText,
  ])

  const validToDateChanged = hasDateChanged(
    workingCase.validToDate,
    modifiedValidToDate?.value,
  )

  const isolationToDateChanged = hasDateChanged(
    workingCase.isolationToDate,
    modifiedIsolationToDate?.value,
  )

  const inPrimaryButtonDisabled = isCaseModificationInvalid(
    validToDateChanged,
    isolationToDateChanged,
    caseModifiedExplanation,
    modifiedValidToDate,
    workingCase.isCustodyIsolation,
    modifiedIsolationToDate,
  )

  return (
    <Modal
      title={getTitle(workingCase.type)}
      text={getText(workingCase.type)}
      primaryButtonText="Staðfesta"
      isPrimaryButtonDisabled={inPrimaryButtonDisabled}
      onPrimaryButtonClick={handleDateModification}
      isPrimaryButtonLoading={isSendingNotification || isUpdatingCase}
      secondaryButtonText="Hætta við"
      onSecondaryButtonClick={() => {
        setCaseModifiedExplanation(undefined)

        if (workingCase.validToDate) {
          setModifiedValidToDate({
            value: new Date(workingCase.validToDate),
            isValid: true,
          })
        }

        if (workingCase.isolationToDate) {
          setModifiedIsolationToDate({
            value: new Date(workingCase.isolationToDate),
            isValid: true,
          })
        }
        setIsModifyingDates(false)
      }}
    >
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Text variant="h3" as="h2">
            {formatMessage(m.sections.modifyDatesModal.reasonForChangeTitle)}
          </Text>
        </Box>
        <Input
          name="reason"
          label={formatMessage(
            m.sections.modifyDatesModal.reasonForChangeLabel,
          )}
          placeholder={formatMessage(
            m.sections.modifyDatesModal.reasonForChangePlaceholder,
            { caseType: workingCase.type },
          )}
          onChange={(event) => {
            handleCaseModifiedExplanationChange(event.target.value)
          }}
          onBlur={(event) =>
            handleCaseModifiedExplanationBlur(event.target.value)
          }
          hasError={caseModifiedExplanationErrorMessage !== ''}
          errorMessage={caseModifiedExplanationErrorMessage}
          textarea
          rows={9}
          required
        />
      </Box>
      <Box marginBottom={6}>
        <BlueBox>
          <DateTime
            name="modifiedValidToDate"
            size="sm"
            datepickerLabel={formatMessage(
              m.sections.modifyDatesModal.modifiedValidToDateLabel,
              {
                caseType: workingCase.type,
              },
            )}
            selectedDate={modifiedValidToDate?.value}
            onChange={(value, valid) => {
              handleValidToDateModification(value, valid)
            }}
            minDate={
              workingCase.rulingDate
                ? new Date(workingCase.rulingDate)
                : undefined
            }
            blueBox={false}
            required
          />
          {workingCase.isCustodyIsolation && (
            <Box marginTop={2}>
              <DateTime
                name="modifiedIsolationToDate"
                size="sm"
                datepickerLabel={formatMessage(
                  m.sections.modifyDatesModal.modifiedIsolationToDateLabel,
                )}
                selectedDate={modifiedIsolationToDate?.value}
                onChange={(value, valid) => {
                  setModifiedIsolationToDate({
                    value: value ?? modifiedIsolationToDate?.value,
                    isValid: valid,
                  })
                }}
                minDate={
                  workingCase.rulingDate
                    ? new Date(workingCase.rulingDate)
                    : undefined
                }
                maxDate={modifiedValidToDate?.value}
                blueBox={false}
                required
              />
            </Box>
          )}
        </BlueBox>
      </Box>
    </Modal>
  )
}
export default ModifyDatesModal
