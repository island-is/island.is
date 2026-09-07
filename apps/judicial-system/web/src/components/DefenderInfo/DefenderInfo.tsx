import type { Dispatch, FC, SetStateAction } from 'react'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Tooltip } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isInvestigationCase,
  isProsecutionUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  InputAdvocate,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  RequestSharedWithDefender,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { defenderInfo } from './DefenderInfo.strings'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const DefenderInfo: FC<Props> = ({ workingCase, setWorkingCase }) => {
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { user } = useContext(UserContext)

  const requestAccessTitle = formatMessage(
    isRestrictionCase(workingCase.type)
      ? defenderInfo.restrictionCases.sections.defenderRequestAccess.title
      : defenderInfo.investigationCases.sections.defenderRequestAccess.title,
  )

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
              title={requestAccessTitle}
              heading="h4"
              marginTop={2}
              marginBottom={2}
              required={!!workingCase.defenderName}
            />
            <RadioGroup legend={requestAccessTitle} hideLegend>
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
                  name="defender-access"
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
            </RadioGroup>
          </>
        )}
      </BlueBox>
    </>
  )
}

export default DefenderInfo
