import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { Box, Button } from '@island.is/island-ui/core'
import { DateTime } from '@island.is/judicial-system-web/src/components'

import * as styles from '../AppealSection/AppealSection.css'

interface Props {
  setProsecutorAppealDate: (date?: Date) => void
  isInitialMount: boolean
}

const ProsecutorAppealDatePicker: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { setProsecutorAppealDate, isInitialMount } = props
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
      key="prosecutorAppealDatepicker"
      variants={animateInAndOut}
      initial={isInitialMount ? false : { y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
    >
      <div className={styles.appealInnerWrapper}>
        <DateTime
          name="prosecutorAppealDate"
          size="sm"
          datepickerPlaceholder="Hvenær var kært?"
          onChange={(date) => setAppealDate(date)}
          maxDate={new Date()}
          blueBox={false}
        />
        <Box className={styles.appealButton}>
          <Button
            onClick={() => setProsecutorAppealDate(appealDate)}
            disabled={!appealDate}
          >
            Sækjandi kærir
          </Button>
        </Box>
      </div>
    </motion.div>
  )
}

export default ProsecutorAppealDatePicker
