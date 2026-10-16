import type { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { RadioButton, Stack } from '@island.is/island-ui/core'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { defenderInfo } from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo.strings'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
  defendant: Defendant
}

const RequestCaseDefenderSharing: FC<Props> = ({
  workingCase,
  setWorkingCase,
  defendant,
}) => {
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()

  const sections = isRestrictionCase(workingCase.type)
    ? defenderInfo.restrictionCases.sections
    : defenderInfo.investigationCases.sections
  const requestAccessTitle = formatMessage(sections.defenderRequestAccess.title)
  const hasDefender = Boolean(defendant.defenderName)

  const options = [
    {
      id: 'defender-access-ready-for-court',
      label: sections.defenderRequestAccess.labelReadyForCourt,
      value: RequestSharedWithDefender.READY_FOR_COURT,
    },
    {
      id: 'defender-access-court-date',
      label: sections.defenderRequestAccess.labelCourtDate,
      value: RequestSharedWithDefender.COURT_DATE,
    },
    {
      id: 'defender-access-no',
      label: sections.defenderRequestAccess.labelNoAccess,
      value: RequestSharedWithDefender.NOT_SHARED,
    },
  ]

  return (
    <>
      <SectionHeading
        title={requestAccessTitle}
        heading="h4"
        variant="h4"
        marginTop={2}
        marginBottom={2}
        required={hasDefender}
      />
      <RadioGroup legend={requestAccessTitle} hideLegend>
        <Stack space={2}>
          {options.map(({ id, label, value }) => (
            <RadioButton
              key={id}
              name={`defender-access-${defendant.id}`}
              id={`${id}-${defendant.id}`}
              label={formatMessage(label)}
              checked={defendant.requestSharedWithDefender === value}
              onChange={() => {
                setAndSendDefendantToServer(
                  {
                    caseId: workingCase.id,
                    defendantId: defendant.id,
                    requestSharedWithDefender: value,
                  },
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
              disabled={!hasDefender}
            />
          ))}
        </Stack>
      </RadioGroup>
    </>
  )
}

export default RequestCaseDefenderSharing
