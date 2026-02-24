import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  formatDate,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import { getIndictmentAppealDeadline } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'

import {
  CaseIndictmentRulingDecision,
  Defendant,
  ServiceRequirement,
} from '../../graphql/schema'
import { formatDateForServer } from '../../utils/hooks'
import useVerdict from '../../utils/hooks/useVerdict'
import DateTime from '../DateTime/DateTime'
import { FormContext } from '../FormProvider/FormProvider'
import { getAppealExpirationInfo } from '../InfoCard/DefendantInfo/DefendantInfo.logic'
import SectionHeading from '../SectionHeading/SectionHeading'
import VerdictAppealDecisionChoice from '../VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
import { strings } from './BlueBoxWithDate.strings'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  canDefendantAppealVerdict: boolean
  icon?: IconMapIcon
}

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, canDefendantAppealVerdict, icon } = props
  const { verdict } = defendant
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendVerdictToServer } = useVerdict()

  const hasMountedRef = useRef<boolean>(false)
  const previousTextCountRef = useRef<number>(0)

  const [pendingServiceDate, setPendingServiceDate] = useState<Date>()
  const [pendingAppealDate, setPendingAppealDate] = useState<Date>()
  const [isServiceDatePickerClosing, setIsServiceDatePickerClosing] =
    useState<boolean>(false)
  const [isAppealDatePickerClosing, setIsAppealDatePickerClosing] =
    useState<boolean>(false)
  const [dates, setDates] = useState<{
    serviceDate?: Date
    appealDate?: Date
  }>({
    serviceDate: undefined,
    appealDate: undefined,
  })

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const isServiceRequired =
    verdict?.serviceRequirement === ServiceRequirement.REQUIRED

  const showDatePickers = !defendant.isSentToPrisonAdmin && !isFine

  const showAppealDatePicker =
    canDefendantAppealVerdict &&
    !verdict?.appealDate &&
    !defendant.isVerdictAppealDeadlineExpired
  const shouldShowAppealDatePicker =
    showAppealDatePicker && !isAppealDatePickerClosing

  const showServiceDateDatePicker = isServiceRequired && !verdict?.serviceDate
  const shouldShowServiceDatePicker =
    showServiceDateDatePicker && !isServiceDatePickerClosing

  const collapsibleRowVariants = {
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  }

  const appealExpirationInfo = useMemo(() => {
    const { verdictAppealDeadline, isVerdictAppealDeadlineExpired } = defendant
    const appealDeadlineResult = verdictAppealDeadline
      ? {
          deadlineDate: verdictAppealDeadline,
          isDeadlineExpired: !!isVerdictAppealDeadlineExpired,
        }
      : dates.serviceDate
      ? getIndictmentAppealDeadline({
          baseDate: dates.serviceDate,
          isFine: false,
        })
      : undefined

    return getAppealExpirationInfo({
      verdictAppealDeadline: appealDeadlineResult?.deadlineDate,
      isVerdictAppealDeadlineExpired:
        appealDeadlineResult?.isDeadlineExpired ?? false,
    })
  }, [dates.serviceDate, defendant])

  const serviceRequirementText = useMemo(
    () =>
      verdict?.serviceRequirement
        ? getServiceRequirementText(verdict.serviceRequirement)
        : null,
    [verdict?.serviceRequirement],
  )

  const textItems = useMemo(() => {
    const texts: string[] = []

    const pushIf = (condition: boolean, message: string | null) => {
      if (condition && message) {
        texts.push(message)
      }
    }

    pushIf(!!serviceRequirementText, serviceRequirementText)

    if (isFine) {
      texts.push(
        formatMessage(strings.fineAppealDeadline, {
          appealDeadlineIsInThePast: defendant.isVerdictAppealDeadlineExpired,
          appealDeadline: formatDate(defendant.verdictAppealDeadline),
        }),
      )
    } else if (verdict?.serviceDate) {
      pushIf(
        !!isServiceRequired,
        formatMessage(strings.defendantVerdictViewedDate, {
          date: formatDate(verdict?.serviceDate),
        }),
      )

      texts.push(
        formatMessage(appealExpirationInfo.message, {
          appealExpirationDate: appealExpirationInfo.date,
          deadlineType: verdict?.isDefaultJudgement
            ? 'Endurupptökufrestur'
            : 'Áfrýjunarfrestur',
        }),
      )

      pushIf(
        !!verdict?.appealDate,
        formatMessage(strings.defendantAppealDate, {
          date: formatDate(verdict?.appealDate),
        }),
      )
    }

    pushIf(
      !!(defendant.sentToPrisonAdminDate && defendant.isSentToPrisonAdmin),
      formatMessage(strings.sendToPrisonAdminDate, {
        date: formatDate(defendant.sentToPrisonAdminDate),
      }),
    )

    return texts
  }, [
    appealExpirationInfo.date,
    appealExpirationInfo.message,
    defendant,
    formatMessage,
    isFine,
    isServiceRequired,
    serviceRequirementText,
    verdict,
  ])

  const handleDateChange = (
    date: Date | undefined,
    valid: boolean,
    type: keyof typeof dates,
  ) => {
    if (!date) {
      // Do nothing
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    setDates((prev) => ({ ...prev, [type]: date }))
  }

  const handleSetDate = (type: keyof typeof dates) => {
    const date = dates[type]

    if (!date) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    // Service date: hide picker first, then submit on exit complete
    if (type === 'serviceDate') {
      setPendingServiceDate(date)
      setIsServiceDatePickerClosing(true)
      return
    }

    // Appeal date: hide picker first, then submit on exit complete
    if (type === 'appealDate') {
      setPendingAppealDate(date)
      setIsAppealDatePickerClosing(true)
      return
    }

    const payload = {
      caseId: workingCase.id,
      defendantId: defendant.id,
      [type]: formatDateForServer(date),
    }

    setAndSendVerdictToServer(payload, setWorkingCase)
  }

  const sendVerdictDate = (type: 'serviceDate' | 'appealDate', date: Date) => {
    setAndSendVerdictToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        [type]: formatDateForServer(date),
      },
      setWorkingCase,
    )
  }

  useEffect(() => {
    hasMountedRef.current = true
    previousTextCountRef.current = textItems.length
  }, [textItems.length])

  useEffect(() => {
    if (isServiceDatePickerClosing && verdict?.serviceDate) {
      setIsServiceDatePickerClosing(false)
      setPendingServiceDate(undefined)
    }
  }, [isServiceDatePickerClosing, verdict?.serviceDate])

  useEffect(() => {
    if (isAppealDatePickerClosing && verdict?.appealDate) {
      setIsAppealDatePickerClosing(false)
      setPendingAppealDate(undefined)
    }
  }, [isAppealDatePickerClosing, verdict?.appealDate])

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <Box className={styles.dataContainer}>
        <SectionHeading
          title={defendant.name || ''}
          heading="h4"
          marginBottom={0}
        />
        {icon && (
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        )}
        <Text variant="eyebrow">
          {isFine ? 'Viðurlagaákvörðun' : 'Birting dóms'}
        </Text>
      </Box>
      <AnimatePresence initial={false}>
        {textItems.map((text, index) => {
          const addedStartIndex = previousTextCountRef.current
          const isNewItem = hasMountedRef.current && index >= addedStartIndex
          const staggerIndex = isNewItem ? index - addedStartIndex : 0

          return (
            <motion.div
              key={`${defendant.id}-${text}`}
              initial={
                isNewItem
                  ? {
                      opacity: 0,
                      y: 20,
                      height: 0,
                    }
                  : false
              }
              animate={{
                opacity: 1,
                y: 0,
                height: 'auto',
              }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{
                delay: isNewItem ? staggerIndex * 0.2 : 0,
                duration: 0.3,
              }}
            >
              <Text>{`• ${text}`}</Text>
            </motion.div>
          )
        })}
      </AnimatePresence>
      {showDatePickers && (
        <AnimatePresence
          onExitComplete={() => {
            if (isServiceDatePickerClosing && pendingServiceDate) {
              sendVerdictDate('serviceDate', pendingServiceDate)
              setPendingServiceDate(undefined)
            }

            if (isAppealDatePickerClosing && pendingAppealDate) {
              sendVerdictDate('appealDate', pendingAppealDate)
              setPendingAppealDate(undefined)
            }
          }}
        >
          {shouldShowAppealDatePicker && (
            <motion.div
              key="defendantAppealDate"
              variants={{
                visible: {
                  ...collapsibleRowVariants.visible,
                  transition: { opacity: { delay: 0.3 } },
                },
                exit: collapsibleRowVariants.exit,
              }}
              initial="exit"
              animate="visible"
              exit="exit"
            >
              <Box className={styles.dataContainer}>
                <DateTime
                  name="defendantAppealDate"
                  datepickerLabel={formatMessage(
                    strings.defendantAppealDateLabel,
                  )}
                  datepickerPlaceholder={formatMessage(
                    strings.defendantAppealDatePlaceholder,
                  )}
                  size="sm"
                  onChange={(date, valid) =>
                    handleDateChange(date, valid, 'appealDate')
                  }
                  maxDate={new Date()}
                  blueBox={false}
                  dateOnly
                />
                <Button
                  onClick={() => handleSetDate('appealDate')}
                  disabled={!dates.appealDate}
                >
                  {formatMessage(strings.defendantAppealDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          )}
          {shouldShowServiceDatePicker && (
            <motion.div
              key="defendantServiceDate"
              variants={{
                visible: collapsibleRowVariants.visible,
                exit: {
                  ...collapsibleRowVariants.exit,
                  transition: { height: { delay: 0.2 } },
                },
              }}
              initial={false}
              animate="visible"
              exit="exit"
            >
              <Box className={styles.dataContainer}>
                <DateTime
                  name="defendantServiceDate"
                  datepickerLabel={formatMessage(
                    strings.defendantVerdictServiceDateLabel,
                  )}
                  datepickerPlaceholder={formatMessage(
                    strings.defendantVerdictServiceDatePlaceholder,
                  )}
                  size="sm"
                  selectedDate={dates.serviceDate}
                  onChange={(date, valid) =>
                    handleDateChange(date, valid, 'serviceDate')
                  }
                  blueBox={false}
                  maxDate={new Date()}
                  dateOnly
                />
                <Button
                  dataTestId="button-defendant-service-date"
                  onClick={() => handleSetDate('serviceDate')}
                  disabled={!dates.serviceDate}
                >
                  {formatMessage(strings.defendantVerdictServiceDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {canDefendantAppealVerdict && verdict && (
        <motion.div
          key="defendantVerdictAppealDecisionChoice"
          variants={collapsibleRowVariants}
          initial={false}
          animate="visible"
          transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.4 }}
          className={grid({ gap: 2, marginTop: 1 })}
        >
          <Text variant="eyebrow">Afstaða dómfellda til dóms</Text>
          <VerdictAppealDecisionChoice
            defendant={defendant}
            verdict={verdict}
            disabled={!!defendant.isSentToPrisonAdmin}
          />
        </motion.div>
      )}
    </Box>
  )
}

export default BlueBoxWithDate
