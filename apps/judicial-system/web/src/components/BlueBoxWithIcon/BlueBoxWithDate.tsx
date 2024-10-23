import { FC, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { errors } from '@island.is/judicial-system-web/messages'

import { Defendant } from '../../graphql/schema'
import { formatDateForServer, useDefendants } from '../../utils/hooks'
import DateTime from '../DateTime/DateTime'
import { FormContext } from '../FormProvider/FormProvider'
import { getAppealExpirationInfo } from '../InfoCard/DefendantInfo/DefendantInfo'
import SectionHeading from '../SectionHeading/SectionHeading'
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  icon?: IconMapIcon
}

type DateType = 'verdictViewDate' | 'appealDate'

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, icon } = props
  const { formatMessage } = useIntl()
  const [verdictViewDate, setVerdictViewDate] = useState<Date>()
  const [appealDate, setAppealDate] = useState<Date>()
  const [textItems, setTextItems] = useState<string[]>([])
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)

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
      toast.error(formatMessage(errors.createIndictmentCount))
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
      // TODO: handle error
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
      setAndSendDefendantToServer(
        {
          caseId: workingCase.id,
          defendantId: defendant.id,
          verdictAppealDate: formatDateForServer(appealDate),
        },
        setWorkingCase,
      )

      setTimeout(() => {
        addNewText()
      }, 350)
    } else {
      toast.error(formatMessage(errors.general))
    }
  }

  const addNewText = () => {
    setTextItems([
      ...textItems,
      formatMessage(strings.defendantAppealDate, {
        date: formatDate(appealDate),
      }),
    ])
  }

  const componentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const appealExpiration = getAppealExpirationInfo(
      defendant.verdictAppealDeadline,
    )

    setTextItems([
      formatMessage(strings.defendantVerdictViewedDate, {
        date: verdictViewDate
          ? formatDate(verdictViewDate)
          : formatDate(defendant.verdictViewDate),
      }),
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
    defendant.verdictAppealDate,
    defendant.verdictAppealDeadline,
    defendant.verdictViewDate,
    formatMessage,
    verdictViewDate,
  ])

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <motion.div>
        <Box className={styles.titleContainer}>
          <SectionHeading
            title="Lykildagsetningar"
            heading="h4"
            marginBottom={2}
          />
          {icon && (
            <Icon icon={icon} type="outline" color="blue400" size="large" />
          )}
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow">{defendant.name}</Text>
        </Box>
        <AnimatePresence mode="wait">
          {defendant.verdictViewDate ? (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.2, delayChildren: 0.6 },
                  },
                }} // Stagger and delay after second component is visible
              >
                <AnimatePresence>
                  {textItems.map((text, index) => (
                    <motion.p
                      key={index}
                      variants={textVariants}
                      transition={{ duration: 0.4 }}
                      style={{ marginBottom: '16px' }}
                    >
                      <Text>{text}</Text>
                    </motion.p>
                  ))}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {!defendant.verdictAppealDate && (
                  <motion.div
                    key="firstComponent"
                    variants={componentVariants}
                    initial={false}
                    animate="visible"
                    exit="exit"
                    transition={{
                      duration: 0.4,
                      ease: 'easeInOut',
                    }}
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
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              key="secondComponent"
              variants={componentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.2 }}
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
      </motion.div>
    </Box>
  )
}

export default BlueBoxWithDate
