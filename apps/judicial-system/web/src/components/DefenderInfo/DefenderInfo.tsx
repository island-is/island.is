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

import { defenderInfo } from './DefenderInfo.strings'

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
<<<<<<< HEAD
      if (user?.role === UserRole.Prosecutor) {
        return accused.sections.defenderInfo.heading
=======
      if (user?.role === UserRole.PROSECUTOR) {
        return defenderInfo.restrictionCases.sections.defender.heading
>>>>>>> 62013404a06bca08ce70aaa666a118e29a222281
      } else {
        return defenderInfo.restrictionCases.sections.defender.title
      }
    } else {
<<<<<<< HEAD
      if (user?.role === UserRole.Prosecutor) {
        return defendant.sections.defenderInfo.heading
=======
      if (user?.role === UserRole.PROSECUTOR) {
        return defenderInfo.investigationCases.sections.defender.heading
>>>>>>> 62013404a06bca08ce70aaa666a118e29a222281
      } else {
        return defenderInfo.investigationCases.sections.defender.title
      }
    }
  }

  const renderTooltip = () => {
    if (
      isRestrictionCase(workingCase.type) &&
      user?.role &&
      isCourtRole(user.role)
    ) {
      return (
        <Tooltip
          text={formatMessage(
            defenderInfo.restrictionCases.sections.defender.tooltip,
          )}
          placement="right"
        />
      )
    } else if (
      isInvestigationCase(workingCase.type) &&
      user?.role &&
      isCourtRole(user.role)
    ) {
      return (
        <Tooltip
          text={formatMessage(
            defenderInfo.investigationCases.sections.defender.tooltip,
            {
              sessionArrangement: workingCase.sessionArrangements,
            },
          )}
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
        {user?.role === UserRole.Prosecutor && (
          <Box marginTop={2}>
            <Checkbox
              name="sendRequestToDefender"
              label={formatMessage(
                isRestrictionCase(workingCase.type)
                  ? defenderInfo.restrictionCases.sections.sendRequest.label
                  : defenderInfo.investigationCases.sections.sendRequest.label,
              )}
              tooltip={
                isRestrictionCase(workingCase.type)
                  ? formatMessage(
                      defenderInfo.restrictionCases.sections.sendRequest
                        .tooltip,
                      {
                        caseType: workingCase.type,
                      },
                    )
                  : formatMessage(
                      defenderInfo.restrictionCases.sections.sendRequest
                        .tooltip,
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
