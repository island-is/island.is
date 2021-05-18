import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Button } from '@island.is/island-ui/core'
import {
  capitalize,
  formatAccusedByGender,
} from '@island.is/judicial-system/formatters'
import * as styles from '../AppealSection/AppealSection.treat'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import { CaseGender } from '@island.is/judicial-system/types'

interface Props {
  handleAccusedAppeal: (date?: Date) => void
  accusedGender: CaseGender
  isInitialMount: boolean
}

const AccusedAppealDatePicker: React.FC<Props> = (props) => {
  const { handleAccusedAppeal, accusedGender, isInitialMount } = props
  const [accusedAppealDate, setAccusedAppealDate] = useState<Date>()

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
          maxDate={new Date()}
          onChange={(date) => setAccusedAppealDate(date)}
          size="sm"
          blueBox={false}
        />
        <Box className={styles.appealButton}>
          <Button
            onClick={() => handleAccusedAppeal(accusedAppealDate)}
            disabled={!accusedAppealDate}
          >
            {`${capitalize(formatAccusedByGender(accusedGender))} kærir`}
          </Button>
        </Box>
      </div>
    </motion.div>
  )
}

export default AccusedAppealDatePicker
