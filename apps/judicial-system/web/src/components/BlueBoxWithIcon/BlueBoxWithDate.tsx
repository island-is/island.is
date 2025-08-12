import { FC, useContext, useMemo, useState } from 'react'
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
import { formatDate } from '@island.is/judicial-system/formatters'
import { getIndictmentAppealDeadlineDate } from '@island.is/judicial-system/types'
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
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  icon?: IconMapIcon
}

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, icon } = props
  const { verdict } = defendant

  const { formatMessage } = useIntl()
  const [dates, setDates] = useState<{
    serviceDate?: Date
    appealDate?: Date
  }>({
    serviceDate: undefined,
    appealDate: undefined,
  })
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false)
  const [triggerAnimation2, setTriggerAnimation2] = useState<boolean>(false)
  const { setAndSendVerdictToServer } = useVerdict()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const isServiceRequired =
    verdict?.serviceRequirement === ServiceRequirement.REQUIRED

  const shouldHideDatePickers = Boolean(
    verdict?.appealDate ||
      defendant.isVerdictAppealDeadlineExpired ||
      defendant.isSentToPrisonAdmin ||
      isFine,
  )

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

    const payload = {
      caseId: workingCase.id,
      defendantId: defendant.id,
      [type]: formatDateForServer(date),
    }

    setAndSendVerdictToServer(payload, setWorkingCase)

    if (type === 'appealDate') {
      setTriggerAnimation2(true)
    }
  }

  const appealExpirationInfo = useMemo(() => {
    const deadline =
      defendant.verdictAppealDeadline ||
      (dates.serviceDate &&
        getIndictmentAppealDeadlineDate(dates.serviceDate, false).toISOString())

    return getAppealExpirationInfo(
      deadline,
      defendant.isVerdictAppealDeadlineExpired,
    )
  }, [
    dates.serviceDate,
    defendant.isVerdictAppealDeadlineExpired,
    defendant.verdictAppealDeadline,
  ])

  const serviceRequirementText = useMemo(() => {
    switch (verdict?.serviceRequirement) {
      case ServiceRequirement.REQUIRED:
        return 'Birta skal dómfellda dóminn'
      case ServiceRequirement.NOT_REQUIRED:
        return 'Birting dóms ekki þörf'
      case ServiceRequirement.NOT_APPLICABLE:
        return 'Dómfelldi var viðstaddur dómsuppkvaðningu'
      default:
        return null
    }
  }, [verdict?.serviceRequirement])

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

  const serviceDateVariants = {
    hidden: { opacity: 0, y: 15, marginTop: '16px' },
    visible: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: 15,
    },
  }

  const appealDateVariants = {
    hidden: { opacity: 0, y: 15, marginTop: '16px' },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { delay: triggerAnimation ? 0 : 0.4 },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: { opacity: { duration: 0.2 } },
    },
  }

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <Box className={styles.dataContainer}>
        <SectionHeading
          title={formatMessage(
            isFine ? strings.indictmentRulingDecisionFine : strings.keyDates,
          )}
          heading="h4"
          marginBottom={2}
        />
        {icon && (
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        )}
        <Box marginBottom={1}>
          <Text variant="eyebrow">{defendant.name}</Text>
        </Box>
      </Box>
      <AnimatePresence>
        {textItems.map((text, index) => (
          <motion.div
            key={index}
            initial={{
              marginTop: 0,
              opacity: 0,
              y: 20,
              height: triggerAnimation2 ? 0 : 'auto',
            }}
            animate={{
              opacity: 1,
              y: 0,
              height: 'auto',
              marginTop: index === 0 ? 0 : '16px',
            }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{
              delay: index < 4 ? index * 0.2 : 0,
              duration: 0.3,
            }}
            onAnimationComplete={() => setTriggerAnimation(true)}
          >
            <Text marginBottom={1}>{`• ${text}`}</Text>
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {shouldHideDatePickers || !verdict ? null : !isServiceRequired ||
          verdict.serviceDate ? (
          <motion.div
            key="defendantAppealDate"
            variants={appealDateVariants}
            initial="hidden"
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
        ) : (
          <motion.div
            key="defendantServiceDate"
            variants={serviceDateVariants}
            initial={false}
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.4 }}
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
                onClick={() => handleSetDate('serviceDate')}
                disabled={!dates.serviceDate}
              >
                {formatMessage(strings.defendantVerdictServiceDateButtonText)}
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default BlueBoxWithDate
