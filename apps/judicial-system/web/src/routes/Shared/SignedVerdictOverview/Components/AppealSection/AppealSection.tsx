import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { Box, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as styles from './AppealSection.treat'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import AccusedAppealInfo from '../Accused/AccusedAppealInfo'
import ProsecutorAppealInfo from '../Prosecutor/ProsecutorAppealInfo'
import AccusedAppealDatePicker from '../Accused/AccusedAppealDatePicker'
import { useEffectOnce } from 'react-use'
import ProsecutorAppealDatePicker from '../Prosecutor/ProsecutorAppealDatePicker'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { signedVerdictOverview } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'

interface Props {
  workingCase: Case
  setAccusedAppealDate: (date?: Date) => void
  setProsecutorAppealDate: (date?: Date) => void
  withdrawAccusedAppealDate?: () => void
  withdrawProsecutorAppealDate?: () => void
}

const AppealSection: React.FC<Props> = (props) => {
  const {
    workingCase,
    setAccusedAppealDate,
    setProsecutorAppealDate,
    withdrawAccusedAppealDate,
    withdrawProsecutorAppealDate,
  } = props
  const { formatMessage } = useIntl()

  const [isInitialMount, setIsInitialMount] = useState<boolean>(true)

  useEffectOnce(() => {
    setIsInitialMount(false)
  })

  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h3" as="h3">
          Ákvörðun um kæru
        </Text>
      </Box>
      {!workingCase.isAppealDeadlineExpired && workingCase.rulingDate && (
        <Box marginBottom={2}>
          <Text>{`Kærufrestur rennur út ${getAppealEndDate(
            workingCase.rulingDate,
          )}`}</Text>
        </Box>
      )}
      {workingCase.isAppealDeadlineExpired && workingCase.rulingDate && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={`Kærufrestur rann út ${getAppealEndDate(
                workingCase.rulingDate,
              )}`}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={formatMessage(signedVerdictOverview.accusedAppealed, {
                genderedAccused: capitalize(
                  formatAccusedByGender(workingCase.accusedGender),
                ),
                courtEndTime: `${formatDate(
                  workingCase.courtEndTime,
                  'PP',
                )} kl. ${formatDate(workingCase.courtEndTime, 'p')}`,
              })}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={formatMessage(signedVerdictOverview.prosecutorAppealed, {
                genderedAccused: capitalize(
                  formatAccusedByGender(workingCase.accusedGender),
                ),
                courtEndTime: `${formatDate(
                  workingCase.courtEndTime,
                  'PP',
                )} kl. ${formatDate(workingCase.courtEndTime, 'p')}`,
              })}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(workingCase.accusedPostponedAppealDate) ||
          !workingCase.isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!workingCase.accusedPostponedAppealDate &&
                  !workingCase.isAppealGracePeriodExpired && (
                    <AccusedAppealDatePicker
                      workingCase={workingCase}
                      setAccusedAppealDate={setAccusedAppealDate}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {workingCase.accusedPostponedAppealDate &&
                  workingCase.accusedGender && (
                    <AccusedAppealInfo
                      workingCase={workingCase}
                      withdrawAccusedAppealDate={
                        workingCase.isAppealGracePeriodExpired
                          ? undefined
                          : withdrawAccusedAppealDate
                      }
                    />
                  )}
              </AnimatePresence>
            </BlueBox>
          </div>
        )}
      {workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(workingCase.prosecutorPostponedAppealDate) ||
          !workingCase.isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!workingCase.prosecutorPostponedAppealDate &&
                  !workingCase.isAppealGracePeriodExpired && (
                    <ProsecutorAppealDatePicker
                      setProsecutorAppealDate={setProsecutorAppealDate}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {workingCase.prosecutorPostponedAppealDate && (
                  <ProsecutorAppealInfo
                    prosecutorPostponedAppealDate={
                      workingCase.prosecutorPostponedAppealDate
                    }
                    withdrawProsecutorAppealDate={
                      workingCase.isAppealGracePeriodExpired
                        ? undefined
                        : withdrawProsecutorAppealDate
                    }
                  />
                )}
              </AnimatePresence>
            </BlueBox>
          </div>
        )}
    </>
  )
}

export default AppealSection
