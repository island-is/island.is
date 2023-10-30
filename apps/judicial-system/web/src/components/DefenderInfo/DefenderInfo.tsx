import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text, Tooltip } from '@island.is/island-ui/core'
import {
  isCourtRole,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { useCase } from '../../utils/hooks'
import RequiredStar from '../RequiredStar/RequiredStar'
import { UserContext } from '../UserProvider/UserProvider'
import { BlueBox, SectionHeading } from '..'
import DefenderInput from './DefenderInput'
import DefenderNotFound from './DefenderNotFound'
import { defenderInfo } from './DefenderInfo.strings'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const DefenderInfo: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()
  const { user } = useContext(UserContext)

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)

  const getSectionTitle = () => {
    if (isRestrictionCase(workingCase.type)) {
      if (user?.role === UserRole.PROSECUTOR) {
        return defenderInfo.restrictionCases.sections.defender.heading
      } else {
        return defenderInfo.restrictionCases.sections.defender.title
      }
    } else {
      if (user?.role === UserRole.PROSECUTOR) {
        return defenderInfo.investigationCases.sections.defender.heading
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
        <Text variant="h4" marginTop={2} marginBottom={2}>
          {`${formatMessage(
            isRestrictionCase(workingCase.type)
              ? defenderInfo.restrictionCases.sections.defenderRequestAccess
                  .title
              : defenderInfo.investigationCases.sections.defenderRequestAccess
                  .title,
          )} `}
          <RequiredStar />
        </Text>
        {user?.role === UserRole.PROSECUTOR && (
          <Box>
            <Box>
              <RadioButton
                name="defender-access"
                id="defender-access-ready-for-court"
                label={formatMessage(
                  isRestrictionCase(workingCase.type)
                    ? defenderInfo.restrictionCases.sections
                        .defenderRequestAccess.labelReadyForCourt
                    : defenderInfo.investigationCases.sections
                        .defenderRequestAccess.labelReadyForCourt,
                )}
                checked={
                  workingCase.requestSharedWithDefender ===
                  RequestSharedWithDefender.READY_FOR_COURT
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        requestSharedWithDefender:
                          RequestSharedWithDefender.READY_FOR_COURT,
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
                disabled={!workingCase.defenderName}
              />
            </Box>
            <Box marginTop={2}>
              <RadioButton
                name="defender-access"
                id="defender-access-court-date"
                label={formatMessage(
                  isRestrictionCase(workingCase.type)
                    ? defenderInfo.restrictionCases.sections
                        .defenderRequestAccess.labelCourtDate
                    : defenderInfo.investigationCases.sections
                        .defenderRequestAccess.labelCourtDate,
                )}
                checked={
                  workingCase.requestSharedWithDefender ===
                  RequestSharedWithDefender.COURT_DATE
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        requestSharedWithDefender:
                          RequestSharedWithDefender.COURT_DATE,
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
                disabled={!workingCase.defenderName}
              />
            </Box>
            <Box marginTop={2}>
              <RadioButton
                name="defender-access-no"
                id="defender-access-no"
                label={formatMessage(
                  isRestrictionCase(workingCase.type)
                    ? defenderInfo.restrictionCases.sections
                        .defenderRequestAccess.labelNoAccess
                    : defenderInfo.investigationCases.sections
                        .defenderRequestAccess.labelNoAccess,
                )}
                checked={workingCase.requestSharedWithDefender === null}
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        requestSharedWithDefender: null,
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
                disabled={!workingCase.defenderName}
              />
            </Box>
          </Box>
        )}
      </BlueBox>
    </>
  )
}

export default DefenderInfo
