import { FC, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { Defendant } from '../../graphql/schema'
import DateTime from '../DateTime/DateTime'
import SectionHeading from '../SectionHeading/SectionHeading'
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'
import { errors } from '@island.is/judicial-system-web/messages'
import { formatDateForServer, useDefendants } from '../../utils/hooks'
import { FormContext } from '../FormProvider/FormProvider'

interface Props {
  defendant: Defendant
  icon?: IconMapIcon
}

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, icon } = props
  const { formatMessage } = useIntl()
  const [d, setD] = useState<Date>()
  const [dHasBeenSet, setDHasBeenSet] = useState<boolean>()
  const [d2HasBeenSet, setD2HasBeenSet] = useState<boolean>()
  const [textItems, setTextItems] = useState<string[]>([])
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const handleDateChange = (date: Date | undefined, valid: boolean) => {
    if (!date) {
      // Do nothing
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.createIndictmentCount))
    }

    setD(date)
  }

  const handleDateChange2 = () => {
    setD2HasBeenSet(true)
  }
  const handleSetDate = () => {
    if (!d) {
      // TODO: handle error
      return
    }

    setDHasBeenSet(true)
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        verdictViewDate: formatDateForServer(d),
      },
      setWorkingCase,
    )
  }

  const handleSetDate2 = () => {
    addNewText()
  }

  const addNewText = () => {
    setTextItems([...textItems, `Dómi áfrýjað ${formatDate(d)}`])
  }

  const componentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 15 },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    setTextItems([
      `Dómur birtur ${formatDate(d)}`,
      `Áfrýjunarfrestur ákærða er til ${formatDate(d)}`,
    ])
  }, [d, dHasBeenSet])

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <motion.div layout="position">
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
        <AnimatePresence mode="wait" initial={false}>
          {dHasBeenSet ? (
            <>
              <motion.div
                layout="position"
                initial="hidden"
                animate="visible"
                transition={{
                  layout: {
                    duration: 1.5,
                  },
                }}
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
              <motion.div
                key="firstComponent"
                variants={componentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                    onChange={handleDateChange2}
                    blueBox={false}
                    dateOnly
                  />
                  <Button onClick={handleSetDate2} disabled={!d2HasBeenSet}>
                    {formatMessage(strings.defendantAppealDateButtonText)}
                  </Button>
                </Box>
              </motion.div>
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
                  selectedDate={d}
                  onChange={handleDateChange}
                  blueBox={false}
                  dateOnly
                />
                <Button onClick={handleSetDate} disabled={!d}>
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
