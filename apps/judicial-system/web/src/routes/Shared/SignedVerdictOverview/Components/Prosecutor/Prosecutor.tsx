import React, { useEffect, useState } from 'react'
import { motion, useIsPresent } from 'framer-motion'
import { Button } from '@island.is/island-ui/core'

import {
  capitalize,
  formatAccusedByGender,
} from '@island.is/judicial-system/formatters'
import * as styles from '../AppealSection/AppealSection.treat'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import { CaseGender } from '@island.is/judicial-system/types'

interface Props {
  handleProsecutorAppeal: (date?: Date) => void
  isInitialMount: boolean
}

const Prosecutor: React.FC<Props> = (props) => {
  const { handleProsecutorAppeal, isInitialMount } = props
  const isPresent = useIsPresent()
  const [prosecutorAppealDate, setProsecutorAppealDate] = useState<Date>()

  const appealDateVariants = {
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
      variants={appealDateVariants}
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
        <Button
          onClick={() => handleProsecutorAppeal(prosecutorAppealDate)}
          disabled={!Boolean(prosecutorAppealDate)}
        >
          Sækjandi kærir
        </Button>
      </div>
    </motion.div>
  )
}

export default Prosecutor
