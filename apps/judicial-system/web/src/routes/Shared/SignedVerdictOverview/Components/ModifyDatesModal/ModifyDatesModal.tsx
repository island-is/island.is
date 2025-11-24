import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import compareAsc from 'date-fns/compareAsc'
import formatISO from 'date-fns/formatISO'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Input } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  core,
  signedVerdictOverview as m,
} from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DateTime,
  Modal,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { hasDateChanged } from '@island.is/judicial-system-web/src/utils/formHelper'
import { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { createCaseModifiedExplanation } from './ModifyDatesModal.logic'

interface DateTime {
  value?: Date
  isValid: boolean
}

interface Props {
  workingCase: Case
  onSubmit: (updateCase: UpdateCase) => Promise<boolean>
  isSendingNotification: boolean
  isUpdatingCase: boolean
  closeModal: () => void
}

const getModificationSuccessText = (
  workingCase: Case,
  modifiedValidToDate: DateTime | undefined,
  modifiedIsolationToDate: DateTime | undefined,
  formatMessage: IntlShape['formatMessage'],
  userRole?: UserRole | null,
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

  if (workingCase.type === CaseType.TRAVEL_BAN) {
    return formatMessage(m.sections.modifyDatesModal.travelBanSuccessText, {
      date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
        'dagur,',
        'dagsins',
      )} kl. ${formatDate(modifiedValidToDate?.value, constants.TIME_FORMAT)}`,
      userRole,
    })
  } else if (validToDateAndIsolationToDateAreTheSame) {
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
  })
}

const getTitle = (caseType?: CaseType | null): string => {
  switch (caseType) {
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

const getText = (caseType?: CaseType | null): string => {
  switch (caseType) {
    case CaseType.TRAVEL_BAN:
      return 'Hafi farbanni verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd farbanns. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.'
    case CaseType.ADMISSION_TO_FACILITY:
      return 'Hafi vistun eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd vistunar. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.'
    case CaseType.CUSTODY:
      return 'Hafi gæsluvarðhaldi eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd gæsluvarðhalds. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.'
    default:
      // Should never happen
      return ''
  }
}

const getSuccessTitle = (caseType?: CaseType | null): string => {
  switch (caseType) {
    case CaseType.ADMISSION_TO_FACILITY:
      return 'Lengd vistunar breytt'
    case CaseType.TRAVEL_BAN:
      return 'Lengd farbanns breytt'
    case CaseType.CUSTODY:
      return 'Lengd gæsluvarðhalds breytt'
    default:
      // Should never happen
      return ''
  }
}

const ModifyDatesModal: FC<Props> = ({
  workingCase,
  onSubmit,
  isSendingNotification,
  isUpdatingCase,
  closeModal,
}) => {
  const [modifiedValidToDate, setModifiedValidToDate] = useState<DateTime>()
  const [modifiedIsolationToDate, setModifiedIsolationToDate] =
    useState<DateTime>()
  const [caseModifiedExplanation, setCaseModifiedExplanation] =
    useState<string>()

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const modificationSuccessText = getModificationSuccessText(
    workingCase,
    modifiedValidToDate,
    modifiedIsolationToDate,
    formatMessage,
    user?.role,
  )

  const [successText, setSuccessText] = useState<string>()

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
    const { isValid } = validate([[reason, ['empty']]])

    setCaseModifiedExplanation(reason)

    if (isValid) {
      setCaseModifiedExplanationErrorMessage('')
    }
  }

  const handleCaseModifiedExplanationBlur = (reason: string) => {
    const { isValid, errorMessage } = validate([[reason, ['empty']]])

    if (isValid) {
      setCaseModifiedExplanation(reason)
    } else {
      setCaseModifiedExplanationErrorMessage(errorMessage)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {successText ? (
        <motion.div key="success">
          <Modal
            title={getSuccessTitle(workingCase.type)}
            text={successText}
            secondaryButton={{
              text: formatMessage(core.closeModal),
              onClick: () => {
                closeModal()

                setCaseModifiedExplanation(undefined)
                setSuccessText(undefined)
              },
            }}
          />
        </motion.div>
      ) : (
        <motion.div key="modal">
          <Modal
            title={getTitle(workingCase.type)}
            text={getText(workingCase.type)}
            primaryButton={{
              text: 'Staðfesta',
              onClick: handleDateModification,
              isDisabled: isCaseModificationInvalid(),
              isLoading: isSendingNotification || isUpdatingCase,
            }}
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => {
                closeModal()

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
              },
            }}
          >
            <Box marginBottom={5}>
              <SectionHeading
                title={formatMessage(
                  m.sections.modifyDatesModal.reasonForChangeTitle,
                )}
              />
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
                        m.sections.modifyDatesModal
                          .modifiedIsolationToDateLabel,
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
      )}
    </AnimatePresence>
  )
}

export default ModifyDatesModal
