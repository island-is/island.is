import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Button } from '@island.is/island-ui/core'
import {
  capitalize,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as styles from '../AppealSection/AppealSection.treat'

interface Props {
  workingCase: Case
  setAccusedAppealDate: (date?: Date) => void
  isInitialMount: boolean
}

const AccusedAppealDatePicker: React.FC<Props> = (props) => {
  const { workingCase, setAccusedAppealDate, isInitialMount } = props
  const [appealDate, setAppealDate] = useState<Date>()

  const isInvestiagionCase =
    workingCase.type !== CaseType.CUSTODY &&
    workingCase.type !== CaseType.TRAVEL_BAN

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
              formatAccusedByGender(
                workingCase.accusedGender,
                NounCases.NOMINATIVE,
                isInvestiagionCase,
              ),
            )} kærir`}
          </Button>
        </Box>
      </div>
    </motion.div>
  )
}

export default AccusedAppealDatePicker
