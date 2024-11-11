import { FC, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_FMST_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { VERDICT_APPEAL_WINDOW_DAYS } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'

import {
  CaseIndictmentRulingDecision,
  Defendant,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '../../graphql/schema'
import { formatDateForServer, useDefendants } from '../../utils/hooks'
import ContextMenu from '../ContextMenu/ContextMenu'
import DateTime from '../DateTime/DateTime'
import { FormContext } from '../FormProvider/FormProvider'
import IconButton from '../IconButton/IconButton'
import { getAppealExpirationInfo } from '../InfoCard/DefendantInfo/DefendantInfo'
import SectionHeading from '../SectionHeading/SectionHeading'
import { contextMenu } from '../ContextMenu/ContextMenu.strings'
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null
  indictmentReviewDecision?: IndictmentCaseReviewDecision | null
  icon?: IconMapIcon
}

type DateType = 'verdictViewDate' | 'appealDate'

const BlueBoxWithDate: FC<Props> = (props) => {
  const {
    defendant,
    indictmentRulingDecision,
    indictmentReviewDecision,
    icon,
  } = props
  const { formatMessage } = useIntl()
  const [verdictViewDate, setVerdictViewDate] = useState<Date>()
  const [appealDate, setAppealDate] = useState<Date>()
  const [textItems, setTextItems] = useState<string[]>([])
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false)
  const [triggerAnimation2, setTriggerAnimation2] = useState<boolean>(false)
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const router = useRouter()

  const serviceRequired =
    defendant.serviceRequirement === ServiceRequirement.REQUIRED

  const handleDateChange = (
    date: Date | undefined,
    valid: boolean,
    dateType: DateType,
  ) => {
    if (!date) {
      // Do nothing
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    dateType === 'verdictViewDate'
      ? setVerdictViewDate(date)
      : setAppealDate(date)
  }

  const handleSetDate = (dateType: DateType) => {
    if (
      (dateType === 'verdictViewDate' && !verdictViewDate) ||
      (dateType === 'appealDate' && !appealDate)
    ) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    if (dateType === 'verdictViewDate' && verdictViewDate) {
      setAndSendDefendantToServer(
        {
          caseId: workingCase.id,
          defendantId: defendant.id,
          verdictViewDate: formatDateForServer(verdictViewDate),
        },
        setWorkingCase,
      )
    } else if (dateType === 'appealDate' && appealDate) {
      setTriggerAnimation2(true)
      setAndSendDefendantToServer(
        {
          caseId: workingCase.id,
          defendantId: defendant.id,
          verdictAppealDate: formatDateForServer(appealDate),
        },
        setWorkingCase,
      )
    } else {
      toast.error(formatMessage(errors.general))
    }
  }

  const datePickerVariants = {
    dpHidden: { opacity: 0, y: 15, marginTop: '16px' },
    dpVisible: { opacity: 1, y: 0 },
    dpExit: {
      opacity: 0,
      y: 15,
    },
  }

  const datePicker2Variants = {
    dpHidden: { opacity: 0, y: 15, marginTop: '16px' },
    dpVisible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { delay: triggerAnimation ? 0 : 0.4 },
    },
    dpExit: {
      opacity: 0,
      height: 0,
      transition: { opacity: { duration: 0.2 } },
    },
  }

  useEffect(() => {
    const verdictAppealDeadline = defendant.verdictAppealDeadline
      ? defendant.verdictAppealDeadline
      : verdictViewDate
      ? addDays(
          new Date(verdictViewDate),
          VERDICT_APPEAL_WINDOW_DAYS,
        ).toISOString()
      : null

    const appealExpiration = getAppealExpirationInfo(
      verdictAppealDeadline,
      defendant.isVerdictAppealDeadlineExpired,
    )

    setTextItems([
      ...(serviceRequired
        ? [
            formatMessage(strings.defendantVerdictViewedDate, {
              date: verdictViewDate
                ? formatDate(verdictViewDate)
                : formatDate(defendant.verdictViewDate),
            }),
          ]
        : []),
      formatMessage(appealExpiration.message, {
        appealExpirationDate: appealExpiration.date,
      }),
      ...(defendant.verdictAppealDate
        ? [
            formatMessage(strings.defendantAppealDate, {
              date: formatDate(defendant.verdictAppealDate),
            }),
          ]
        : []),
    ])
  }, [
    defendant.isVerdictAppealDeadlineExpired,
    defendant.verdictAppealDate,
    defendant.verdictAppealDeadline,
    defendant.verdictViewDate,
    formatMessage,
    indictmentRulingDecision,
    serviceRequired,
    verdictViewDate,
  ])

  return (
    <>
      <Box className={styles.container} padding={[2, 2, 3, 3]}>
        <Box className={styles.titleContainer}>
          <SectionHeading
            title={formatMessage(strings.keyDates)}
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
          {(!serviceRequired || defendant.verdictViewDate) &&
            textItems.map((text, index) => (
              <motion.div
                key={index}
                initial={{
                  marginTop: index === 0 ? 0 : '16px',
                  opacity: 0,
                  y: 20,
                  height: triggerAnimation2 ? 0 : 'auto',
                }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: index < 3 ? index * 0.2 : 0,
                  duration: 0.3,
                }}
                onAnimationComplete={() => setTriggerAnimation(true)}
              >
                <Text>{`• ${text}`}</Text>
              </motion.div>
            ))}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {defendant.verdictAppealDate ||
          defendant.isVerdictAppealDeadlineExpired ? null : !serviceRequired ||
            defendant.verdictViewDate ? (
            <motion.div
              key="defendantAppealDate"
              variants={datePicker2Variants}
              initial="dpHidden"
              animate="dpVisible"
              exit="dpExit"
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
                  disabled={!appealDate}
                >
                  {formatMessage(strings.defendantAppealDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="defendantVerdictViewDate"
              variants={datePickerVariants}
              initial={false}
              animate="dpVisible"
              exit="dpExit"
              transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.4 }}
            >
              <Box className={styles.dataContainer}>
                <DateTime
                  name="defendantVerdictViewDate"
                  datepickerLabel={formatMessage(
                    strings.defendantVerdictViewDateLabel,
                  )}
                  datepickerPlaceholder={formatMessage(
                    strings.defendantVerdictViewDatePlaceholder,
                  )}
                  size="sm"
                  selectedDate={verdictViewDate}
                  onChange={(date, valid) =>
                    handleDateChange(date, valid, 'verdictViewDate')
                  }
                  blueBox={false}
                  maxDate={new Date()}
                  dateOnly
                />
                <Button
                  onClick={() => handleSetDate('verdictViewDate')}
                  disabled={!verdictViewDate}
                >
                  {formatMessage(strings.defendantVerdictViewDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <Box display="flex" justifyContent={'flexEnd'} marginTop={1}>
        <Button
          variant="text"
          onClick={() =>
            router.push(
              `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_FMST_ROUTE}/${workingCase.id}`,
            )
          }
          size="small"
          disabled={!indictmentReviewDecision}
        >
          {formatMessage(strings.sendToFMST)}
        </Button>
      </Box>
    </>
  )
}

export default BlueBoxWithDate
