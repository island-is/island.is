import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import { Box, Button } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import * as styles from '../AppealSection/AppealSection.css'

interface Props {
  workingCase: Case
  setAccusedAppealDate: (date?: Date) => void
  isInitialMount: boolean
}

const AccusedAppealDatePicker: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { workingCase, setAccusedAppealDate, isInitialMount } = props
  const { formatMessage } = useIntl()
  const [appealDate, setAppealDate] = useState<Date>()

  const animateInAndOut = {
    visible: {
      y: 0,
      opacity: 1,
      maxHeight: '100%',
      transition: { duration: 0.4, delay: 0.4 },
    },
    hidden: {
      y: 20,
      opacity: 0,
      maxHeight: '0%',
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      key="accusedAppealDatepicker"
      variants={animateInAndOut}
      initial={isInitialMount ? false : { y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
    >
      <div className={styles.appealInnerWrapper}>
        <DateTime
          name="accusedAppealDate"
          size="sm"
          datepickerPlaceholder="Hvenær var kært?"
          maxDate={new Date()}
          onChange={(date) => setAppealDate(date)}
          blueBox={false}
        />
        <Box className={styles.appealButton}>
          <Button
            onClick={() => setAccusedAppealDate(appealDate)}
            disabled={!appealDate}
          >
            {`${capitalize(
              formatMessage(core.defendant, {
                suffix:
                  workingCase.defendants && workingCase.defendants.length > 1
                    ? 'ar'
                    : 'i',
              }),
            )} ${
              workingCase.defendants && workingCase.defendants.length > 1
                ? 'kæra'
                : 'kærir'
            }`}
          </Button>
        </Box>
      </div>
    </motion.div>
  )
}

export default AccusedAppealDatePicker
