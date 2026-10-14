import type { Dispatch, FC, SetStateAction } from 'react'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text, Tooltip } from '@island.is/island-ui/core'
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
  getDefendantRequestSharingUpdate,
} from './RequestCaseDefenderInfo.logic'
import RequestCaseDefenderSharing from './RequestCaseDefenderSharing'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
  defendant: Defendant
  // Pages listing several defenders under one heading set these so the
  // heading is shown once and each box names its defendant.
  hideHeading?: boolean
  showDefendantName?: boolean
}

const RequestCaseDefenderInfo: FC<Props> = ({
  workingCase,
  setWorkingCase,
  defendant,
  hideHeading,
  showDefendantName,
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

  const mirrorToCase = (
    contact: Parameters<typeof buildCaseDefenderMirrorUpdate>[0],
  ) => {
    setAndSendCaseToServer(
      [buildCaseDefenderMirrorUpdate(contact)],
      workingCase,
      setWorkingCase,
    )
  }

  const handleAdvocateChange = async (
    defenderName: string | null,
    defenderNationalId: string | null,
    defenderEmail: string | null,
    defenderPhoneNumber: string | null,
  ) => {
    const updated = await setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        defenderName,
        defenderNationalId,
        defenderEmail,
        defenderPhoneNumber,
        ...getDefendantRequestSharingUpdate({
          isCourtUser: isDistrictCourtUser(user),
          nextDefenderName: defenderName,
        }),
      },
      setWorkingCase,
    )

    if (!updated) {
      return
    }

    mirrorToCase({
      defenderName,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
    })
  }

  const handleEmailSave = async (defenderEmail: string | null) => {
    const updated = await updateDefendant({
      caseId: workingCase.id,
      defendantId: defendant.id,
      defenderEmail,
    })

    if (!updated) {
      return
    }

    mirrorToCase({
      defenderName: defendant.defenderName ?? null,
      defenderNationalId: defendant.defenderNationalId ?? null,
      defenderEmail,
      defenderPhoneNumber: defendant.defenderPhoneNumber ?? null,
    })
  }

  const handlePhoneNumberSave = async (defenderPhoneNumber: string | null) => {
    const updated = await updateDefendant({
      caseId: workingCase.id,
      defendantId: defendant.id,
      defenderPhoneNumber,
    })

    if (!updated) {
      return
    }

    mirrorToCase({
      defenderName: defendant.defenderName ?? null,
      defenderNationalId: defendant.defenderNationalId ?? null,
      defenderEmail: defendant.defenderEmail ?? null,
      defenderPhoneNumber,
    })
  }

  return (
    <>
      {!hideHeading && (
        <SectionHeading title={getSectionTitle()} tooltip={renderTooltip()} />
      )}
      <BlueBox>
        {showDefendantName && defendant.name && (
          <Box marginBottom={2}>
            <Text variant="h4">{defendant.name}</Text>
          </Box>
        )}
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
        {isProsecutionUser(user) && (
          <RequestCaseDefenderSharing
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            defendant={defendant}
          />
        )}
      </BlueBox>
    </>
  )
}

export default RequestCaseDefenderInfo
