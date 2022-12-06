import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Tooltip } from '@island.is/island-ui/core'

import {
  Case,
  isCourtRole,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  accused,
  defendant,
  rcHearingArrangements,
  icHearingArrangements,
} from '@island.is/judicial-system-web/messages'

import { BlueBox, SectionHeading } from '..'
import { useCase } from '../../utils/hooks'
import { UserContext } from '../UserProvider/UserProvider'
import DefenderInput from './DefenderInput'
import DefenderNotFound from './DefenderNotFound'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const DefenderInfo: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()
  const { user } = useContext(UserContext)

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)

  const getSectionTitle = () => {
    if (isRestrictionCase(workingCase.type)) {
      if (user?.role === UserRole.PROSECUTOR) {
        return accused.sections.defenderInfo.heading
      } else {
        return rcHearingArrangements.sections.defender.title
      }
    } else {
      if (user?.role === UserRole.PROSECUTOR) {
        return defendant.sections.defenderInfo.heading
      } else {
        return icHearingArrangements.sections.defender.title
      }
    }
  }

  const renderTooltip = () => {
    if (
      isRestrictionCase(workingCase.type) &&
      user?.role &&
      isCourtRole(user?.role)
    ) {
      return (
        <Tooltip
          text={formatMessage(rcHearingArrangements.sections.defender.tooltip)}
          placement="right"
        />
      )
    } else if (
      isInvestigationCase(workingCase.type) &&
      user?.role &&
      isCourtRole(user?.role)
    ) {
      return (
        <Tooltip
          text={formatMessage(icHearingArrangements.sections.defender.tooltip, {
            defenderType:
              workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT_SPOKESPERSON
                ? 'talsmaður'
                : 'verjandi',
          })}
          placement="right"
        />
      )
    } else {
      return null
    }
  }

  return (
    <>
      <SectionHeading
        title={formatMessage(getSectionTitle(), {
          defenderType:
            workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? 'Talsmaður'
              : 'Verjandi',
        })}
        tooltip={renderTooltip()}
      />
      {defenderNotFound && <DefenderNotFound />}
      <BlueBox>
        <DefenderInput onDefenderNotFound={setDefenderNotFound} />
        {user?.role === UserRole.PROSECUTOR && (
          <Box marginTop={2}>
            <Checkbox
              name="sendRequestToDefender"
              label={formatMessage(
                isRestrictionCase(workingCase.type)
                  ? accused.sections.defenderInfo.sendRequest.label
                  : defendant.sections.defenderInfo.sendRequest.label,
              )}
              tooltip={
                isRestrictionCase(workingCase.type)
                  ? formatMessage(
                      accused.sections.defenderInfo.sendRequest.tooltipV2,
                      {
                        caseType: workingCase.type,
                      },
                    )
                  : formatMessage(
                      defendant.sections.defenderInfo.sendRequest.tooltip,
                    )
              }
              checked={workingCase.sendRequestToDefender}
              onChange={(event) => {
                setAndSendCaseToServer(
                  [
                    {
                      sendRequestToDefender: event.target.checked,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              filled
            />
          </Box>
        )}
      </BlueBox>
    </>
  )
}

export default DefenderInfo
