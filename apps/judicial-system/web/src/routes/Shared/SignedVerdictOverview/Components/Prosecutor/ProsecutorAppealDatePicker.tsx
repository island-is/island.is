import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Box } from '@island.is/island-ui/core'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import * as styles from '../AppealSection/AppealSection.treat'

interface Props {
  handleProsecutorAppeal: (date?: Date) => void
  isInitialMount: boolean
}

const ProsecutorAppealDatePicker: React.FC<Props> = (props) => {
  const { handleProsecutorAppeal, isInitialMount } = props
  const [prosecutorAppealDate, setProsecutorAppealDate] = useState<Date>()

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
          maxDate={new Date()}
          onChange={(date) => setProsecutorAppealDate(date)}
          size="sm"
          blueBox={false}
        />
        <Box className={styles.appealButton}>
          <Button
            onClick={() => handleProsecutorAppeal(prosecutorAppealDate)}
            disabled={!prosecutorAppealDate}
          >
            Sækjandi kærir
          </Button>
        </Box>
      </div>
    </motion.div>
  )
}

export default ProsecutorAppealDatePicker
