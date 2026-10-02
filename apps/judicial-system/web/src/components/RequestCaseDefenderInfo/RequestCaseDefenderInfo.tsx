import type { Dispatch, FC, SetStateAction } from 'react'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Tooltip } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isInvestigationCase,
  isProsecutionUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  BlueBox,
  InputAdvocate,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { defenderInfo } from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo.strings'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { SessionArrangements } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  buildCaseDefenderMirrorUpdate,
  shouldClearRequestSharedWithDefender,
} from './RequestCaseDefenderInfo.logic'
import RequestCaseDefenderSharing from './RequestCaseDefenderSharing'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
  defendant: Defendant
  // The sharing radios are case-level, so only one instance per page should
  // show them.
  showRequestSharedWithDefender?: boolean
}

const RequestCaseDefenderInfo: FC<Props> = ({
  workingCase,
  setWorkingCase,
  defendant,
  showRequestSharedWithDefender,
}) => {
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()
  const { setAndSendDefendantToServer, updateDefendantState, updateDefendant } =
    useDefendants()
  const { user } = useContext(UserContext)

  const isRestriction = isRestrictionCase(workingCase.type)

  const getSectionTitle = () => {
    if (isRestriction) {
      return formatMessage(
        isProsecutionUser(user)
          ? defenderInfo.restrictionCases.sections.defender.heading
          : defenderInfo.restrictionCases.sections.defender.title,
      )
    }

    if (isProsecutionUser(user)) {
      return formatMessage(
        defenderInfo.investigationCases.sections.defender.heading,
      )
    }

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

  const renderTooltip = () => {
    if (!isDistrictCourtUser(user)) {
      return null
    }

    if (isRestriction) {
      return (
        <Tooltip
          text={formatMessage(
            defenderInfo.restrictionCases.sections.defender.tooltip,
          )}
          placement="right"
        />
      )
    }

    if (isInvestigationCase(workingCase.type)) {
      return (
        <Tooltip
          text={formatMessage(
            defenderInfo.investigationCases.sections.defender.tooltip,
            { sessionArrangement: workingCase.sessionArrangements },
          )}
          placement="right"
        />
      )
    }

    return null
  }

  const mirrorToCase = ({
    defenderName,
    defenderNationalId,
    defenderEmail,
    defenderPhoneNumber,
    isCourtUser,
    clearSharing,
  }: Parameters<typeof buildCaseDefenderMirrorUpdate>[0]) => {
    setAndSendCaseToServer(
      [
        buildCaseDefenderMirrorUpdate({
          defenderName,
          defenderNationalId,
          defenderEmail,
          defenderPhoneNumber,
          isCourtUser,
          clearSharing,
        }),
      ],
      workingCase,
      setWorkingCase,
    )
  }

  const handleAdvocateChange = (
    defenderName: string | null,
    defenderNationalId: string | null,
    defenderEmail: string | null,
    defenderPhoneNumber: string | null,
  ) => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        defenderName,
        defenderNationalId,
        defenderEmail,
        defenderPhoneNumber,
      },
      setWorkingCase,
    )

    mirrorToCase({
      defenderName,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      isCourtUser: isDistrictCourtUser(user),
      clearSharing: shouldClearRequestSharedWithDefender({
        defendants: workingCase.defendants,
        editedDefendantId: defendant.id,
        nextDefenderName: defenderName,
      }),
    })
  }

  const handleEmailSave = (defenderEmail: string | null) => {
    updateDefendant({
      caseId: workingCase.id,
      defendantId: defendant.id,
      defenderEmail,
    })

    mirrorToCase({
      defenderName: defendant.defenderName ?? null,
      defenderNationalId: defendant.defenderNationalId ?? null,
      defenderEmail,
      defenderPhoneNumber: defendant.defenderPhoneNumber ?? null,
      isCourtUser: false,
      clearSharing: false,
    })
  }

  const handlePhoneNumberSave = (defenderPhoneNumber: string | null) => {
    updateDefendant({
      caseId: workingCase.id,
      defendantId: defendant.id,
      defenderPhoneNumber,
    })

    mirrorToCase({
      defenderName: defendant.defenderName ?? null,
      defenderNationalId: defendant.defenderNationalId ?? null,
      defenderEmail: defendant.defenderEmail ?? null,
      defenderPhoneNumber,
      isCourtUser: false,
      clearSharing: false,
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
          name={defendant.defenderName}
          email={defendant.defenderEmail}
          phoneNumber={defendant.defenderPhoneNumber}
          onAdvocateChange={handleAdvocateChange}
          onEmailChange={(defenderEmail: string | null) =>
            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                defenderEmail,
              },
              setWorkingCase,
            )
          }
          onEmailSave={handleEmailSave}
          onPhoneNumberChange={(defenderPhoneNumber: string | null) =>
            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                defenderPhoneNumber,
              },
              setWorkingCase,
            )
          }
          onPhoneNumberSave={handlePhoneNumberSave}
        />
        {showRequestSharedWithDefender && isProsecutionUser(user) && (
          <RequestCaseDefenderSharing
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        )}
      </BlueBox>
    </>
  )
}

export default RequestCaseDefenderInfo
