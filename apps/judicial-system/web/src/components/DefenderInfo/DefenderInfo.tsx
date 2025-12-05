import { Dispatch, FC, SetStateAction, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Tooltip } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isInvestigationCase,
  isProsecutionUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  Case,
  RequestSharedWithDefender,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { UpdateCase, useCase } from '../../utils/hooks'
import { UserContext } from '../UserProvider/UserProvider'
import { BlueBox, InputAdvocate, SectionHeading } from '..'
import { defenderInfo } from './DefenderInfo.strings'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const DefenderInfo: FC<Props> = ({ workingCase, setWorkingCase }) => {
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { user } = useContext(UserContext)

  const getSectionTitle = () => {
    if (isRestrictionCase(workingCase.type)) {
      if (isProsecutionUser(user)) {
        return formatMessage(
          defenderInfo.restrictionCases.sections.defender.heading,
        )
      } else {
        return formatMessage(
          defenderInfo.restrictionCases.sections.defender.title,
        )
      }
    } else {
      if (isProsecutionUser(user)) {
        return formatMessage(
          defenderInfo.investigationCases.sections.defender.heading,
        )
      } else {
        return formatMessage(
          defenderInfo.investigationCases.sections.defender.title,
          {
            defenderType:
              workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT_SPOKESPERSON
                ? 'Talsmaður'
                : 'Verjandi',
          },
        )
      }
    }
  }

  const renderTooltip = () => {
    if (isRestrictionCase(workingCase.type) && isDistrictCourtUser(user)) {
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
      isDistrictCourtUser(user)
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

  const handleSetAndSendCaseToServer = (update: UpdateCase) => {
    setAndSendCaseToServer([update], workingCase, setWorkingCase)
  }

  const handleAdvocateChange = (
    defenderName: string | null,
    defenderNationalId: string | null,
    defenderEmail: string | null,
    defenderPhoneNumber: string | null,
  ) => {
    handleSetAndSendCaseToServer({
      defenderName,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      // if court makes any defender changes we default to not share the request
      ...(isDistrictCourtUser(user)
        ? { requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED }
        : {}),
      ...(!defenderName ? { requestSharedWithDefender: null } : {}),
      force: true,
    })
  }

  return (
    <>
      <SectionHeading title={getSectionTitle()} tooltip={renderTooltip()} />
      <BlueBox>
        <InputAdvocate
          advocateType={
            !isProsecutionUser(user) &&
            workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? 'spokesperson'
              : 'defender'
          }
          name={workingCase.defenderName}
          email={workingCase.defenderEmail}
          phoneNumber={workingCase.defenderPhoneNumber}
          onAdvocateChange={handleAdvocateChange}
          onEmailChange={(defenderEmail: string | null) =>
            setWorkingCase((prev) => ({ ...prev, defenderEmail }))
          }
          onEmailSave={(defenderEmail: string | null) =>
            updateCase(workingCase.id, { defenderEmail })
          }
          onPhoneNumberChange={(defenderPhoneNumber: string | null) =>
            setWorkingCase((prev) => ({ ...prev, defenderPhoneNumber }))
          }
          onPhoneNumberSave={(defenderPhoneNumber: string | null) =>
            updateCase(workingCase.id, { defenderPhoneNumber })
          }
        />
        {isProsecutionUser(user) && (
          <>
            <SectionHeading
              title={formatMessage(
                isRestrictionCase(workingCase.type)
                  ? defenderInfo.restrictionCases.sections.defenderRequestAccess
                      .title
                  : defenderInfo.investigationCases.sections
                      .defenderRequestAccess.title,
              )}
              heading="h4"
              marginTop={2}
              marginBottom={2}
              required={!!workingCase.defenderName}
            />
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
                  handleSetAndSendCaseToServer({
                    requestSharedWithDefender:
                      RequestSharedWithDefender.READY_FOR_COURT,
                    force: true,
                  })
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
                  handleSetAndSendCaseToServer({
                    requestSharedWithDefender:
                      RequestSharedWithDefender.COURT_DATE,
                    force: true,
                  })
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
                checked={
                  workingCase.requestSharedWithDefender ===
                  RequestSharedWithDefender.NOT_SHARED
                }
                onChange={() => {
                  handleSetAndSendCaseToServer({
                    requestSharedWithDefender:
                      RequestSharedWithDefender.NOT_SHARED,
                    force: true,
                  })
                }}
                large
                backgroundColor="white"
                disabled={!workingCase.defenderName}
              />
            </Box>
          </>
        )}
      </BlueBox>
    </>
  )
}

export default DefenderInfo
