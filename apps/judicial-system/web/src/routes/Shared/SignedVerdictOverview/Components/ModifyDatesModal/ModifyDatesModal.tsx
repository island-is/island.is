import React, { useState, useCallback, useEffect, useContext } from 'react'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { useIntl, IntlShape } from 'react-intl'
import { motion } from 'framer-motion'
import {
  BlueBox,
  DateTime,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { Box, Input, Text } from '@island.is/island-ui/core'
import formatISO from 'date-fns/formatISO'
import { UpdateCase, UserRole } from '@island.is/judicial-system/types'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'
import { compareAsc } from 'date-fns'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { hasDateChanged } from '@island.is/judicial-system-web/src/utils/formHelper'

interface DateTime {
  value?: Date
  isValid: boolean
}

interface Props {
  workingCase: Case
  onSubmit: (updateCase: UpdateCase) => void
  isSendingNotification: boolean
  isUpdatingCase: boolean
  setIsModifyingDates: React.Dispatch<React.SetStateAction<boolean>>
}

export const createCaseModifiedExplanation = (
  formatMessage: IntlShape['formatMessage'],
  previousExplaination: string | null | undefined,
  nextExplanation: string,
  userName?: string,
  userTitle?: string,
  institutionName?: string,
): string => {
  const now = new Date()
  const history = previousExplaination
    ? `${previousExplaination}<br/><br/>`
    : ''

  return `${history}${formatMessage(m.sections.modifyDatesInfo.explanation, {
    date: capitalize(formatDate(now, 'PPPP', true) || ''),
    time: formatDate(now, constants.TIME_FORMAT),
    userName: userName ?? '',
    userTitle: userTitle ?? '',
    institutionName: institutionName ?? '',
    explanation: nextExplanation,
  })}`
}

const getModificationSuccessText = (
  workingCase: Case,
  modifiedValidToDate: DateTime | undefined,
  modifiedIsolationToDate: DateTime | undefined,
  formatMessage: IntlShape['formatMessage'],
  userRole?: UserRole,
) => {
  let modification = ''

  const validToDateAndIsolationToDateAreTheSame =
    modifiedValidToDate &&
    modifiedValidToDate.value &&
    workingCase.validToDate &&
    modifiedIsolationToDate &&
    modifiedIsolationToDate.value &&
    workingCase.isolationToDate &&
    compareAsc(modifiedValidToDate?.value, modifiedIsolationToDate?.value) === 0

  const validToDateChanged = hasDateChanged(
    workingCase.validToDate,
    modifiedValidToDate?.value,
  )

  const isolationToDateChanged = hasDateChanged(
    workingCase.isolationToDate,
    modifiedIsolationToDate?.value,
  )

  if (validToDateAndIsolationToDateAreTheSame) {
    modification = formatMessage(
      m.sections.modifyDatesModal.validToDateAndIsolationToDateAreTheSame,
      {
        caseType: workingCase.type,
        date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
          'dagur,',
          'dagsins',
        )} kl. ${formatDate(
          modifiedValidToDate?.value,
          constants.TIME_FORMAT,
        )}`,
      },
    )
  } else if (validToDateChanged || isolationToDateChanged) {
    if (validToDateChanged) {
      modification = formatMessage(
        m.sections.modifyDatesModal.validToDateChanged,
        {
          caseType: workingCase.type,
          date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
            'dagur,',
            'dagsins',
          )} kl. ${formatDate(
            modifiedValidToDate?.value,
            constants.TIME_FORMAT,
          )}`,
        },
      )
    }

    if (isolationToDateChanged) {
      const isolationText = formatMessage(
        m.sections.modifyDatesModal.isolationDateChanged,
        {
          date: `${formatDate(modifiedIsolationToDate?.value, 'PPPP')?.replace(
            'dagur,',
            'dagsins',
          )} kl. ${formatDate(
            modifiedIsolationToDate?.value,
            constants.TIME_FORMAT,
          )}`,
        },
      )
      modification = modification
        ? `${modification} ${isolationText}`
        : isolationText
    }
  }

  return formatMessage(m.sections.modifyDatesModal.successText, {
    modification,
    courtOrProsecutor:
      userRole === UserRole.PROSECUTOR ? 'héraðsdómstól' : 'saksóknaraembætti',
  })
}

const ModifyDatesModal: React.FC<Props> = ({
  workingCase,
  onSubmit,
  isSendingNotification,
  isUpdatingCase,
  setIsModifyingDates,
}) => {
  const [modifiedValidToDate, setModifiedValidToDate] = useState<DateTime>()
  const [
    modifiedIsolationToDate,
    setModifiedIsolationToDate,
  ] = useState<DateTime>()
  const [
    caseModifiedExplanation,
    setCaseModifiedExplanation,
  ] = useState<string>()

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const modificationSuccessText = getModificationSuccessText(
    workingCase,
    modifiedValidToDate,
    modifiedIsolationToDate,
    formatMessage,
    user?.role,
  )

  const [successText, setSuccessText] = useState<string | undefined>(undefined)

  const handleDateModification = useCallback(async () => {
    if (!caseModifiedExplanation) return

    if (!modifiedValidToDate?.value || !modifiedIsolationToDate?.value) return

    const formattedValidToDate = formatISO(modifiedValidToDate.value, {
      representation: 'complete',
    })

    const formattedIsolationToDate = formatISO(modifiedIsolationToDate.value, {
      representation: 'complete',
    })

    const update = {
      validToDate: formattedValidToDate,
      isolationToDate: formattedIsolationToDate,
      caseModifiedExplanation: createCaseModifiedExplanation(
        formatMessage,
        workingCase.caseModifiedExplanation,
        caseModifiedExplanation,
        user?.name,
        user?.title,
        user?.institution?.name,
      ),
    }

    onSubmit(update)
    setSuccessText(modificationSuccessText)
  }, [
    caseModifiedExplanation,
    workingCase.caseModifiedExplanation,
    modifiedValidToDate?.value,
    modifiedIsolationToDate?.value,
    onSubmit,
  ])

  useEffect(() => {
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
  }, [
    workingCase.validToDate,
    workingCase.isolationToDate,
    setModifiedValidToDate,
    setModifiedIsolationToDate,
  ])

  const validToDateChanged = hasDateChanged(
    workingCase.validToDate,
    modifiedValidToDate?.value,
  )

  const isolationToDateChanged = hasDateChanged(
    workingCase.isolationToDate,
    modifiedIsolationToDate?.value,
  )

  const isCaseModificationInvalid = () => {
    return (
      !caseModifiedExplanation ||
      !caseModifiedExplanation.trim() ||
      !modifiedValidToDate?.isValid ||
      (workingCase.isCustodyIsolation && !modifiedIsolationToDate?.isValid) ||
      (!validToDateChanged && !isolationToDateChanged)
    )
  }

  const handleValidToDateModification = (
    value: Date | undefined,
    valid: boolean,
  ) => {
    const validToDate = value ?? modifiedValidToDate?.value

    if (
      validToDate &&
      workingCase.isCustodyIsolation &&
      (!modifiedIsolationToDate?.value ||
        compareAsc(validToDate, new Date(modifiedIsolationToDate.value)) === -1)
    ) {
      setModifiedIsolationToDate({
        value: validToDate,
        isValid: valid,
      })
    }

    setModifiedValidToDate({
      value: validToDate,
      isValid: valid,
    })
  }

  const [
    caseModifiedExplanationErrorMessage,
    setCaseModifiedExplanationErrorMessage,
  ] = useState<string>('')

  const handleCaseModifiedExplanationChange = (reason: string) => {
    const { isValid } = validate(reason, 'empty')

    setCaseModifiedExplanation(reason)

    if (isValid) {
      setCaseModifiedExplanationErrorMessage('')
    }
  }

  const handleCaseModifiedExplanationBlur = (reason: string) => {
    const { isValid, errorMessage } = validate(reason, 'empty')

    if (isValid) {
      setCaseModifiedExplanation(reason)
    } else {
      setCaseModifiedExplanationErrorMessage(errorMessage)
    }
  }

  return successText ? (
    <motion.div
      key="dateModifyingModalSuccess"
      data-testid="dateModifyingModalSuccess"
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Modal
        title={formatMessage(m.sections.modifyDatesModal.successTitleV2, {
          caseType: workingCase.type,
        })}
        text={successText}
        secondaryButtonText={formatMessage(
          m.sections.modifyDatesModal.secondaryButtonTextSuccess,
        )}
        handleSecondaryButtonClick={() => {
          setCaseModifiedExplanation(undefined)
          setIsModifyingDates(false)
          setSuccessText(undefined)
        }}
      />
    </motion.div>
  ) : (
    <motion.div
      key="dateModifyingModal"
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Modal
        title={formatMessage(m.sections.modifyDatesModal.titleV2, {
          caseType: workingCase.type,
        })}
        text={formatMessage(m.sections.modifyDatesModal.textV2, {
          caseType: workingCase.type,
        })}
        primaryButtonText={formatMessage(
          m.sections.modifyDatesModal.primaryButtonText,
        )}
        isPrimaryButtonDisabled={isCaseModificationInvalid()}
        handlePrimaryButtonClick={handleDateModification}
        isPrimaryButtonLoading={isSendingNotification || isUpdatingCase}
        secondaryButtonText={formatMessage(
          m.sections.modifyDatesModal.secondaryButtonText,
        )}
        handleSecondaryButtonClick={() => {
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
              m.sections.modifyDatesModal.reasonForChangePlaceholderV2,
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
                m.sections.modifyDatesModal.modifiedValidToDateLabelV2,
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
    </motion.div>
  )
}

export default ModifyDatesModal
