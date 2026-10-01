import type { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton } from '@island.is/island-ui/core'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { defenderInfo } from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo.strings'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { anyDefendantHasDefender } from './RequestCaseDefenderInfo.logic'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
}

const RequestCaseDefenderSharing: FC<Props> = ({
  workingCase,
  setWorkingCase,
}) => {
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()

  const sections = isRestrictionCase(workingCase.type)
    ? defenderInfo.restrictionCases.sections
    : defenderInfo.investigationCases.sections
  const requestAccessTitle = formatMessage(sections.defenderRequestAccess.title)
  const hasDefender = anyDefendantHasDefender(workingCase.defendants)

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
        marginTop={2}
        marginBottom={2}
        required={hasDefender}
      />
      <RadioGroup legend={requestAccessTitle} hideLegend>
        {options.map(({ id, label, value }, index) => (
          <Box key={id} marginTop={index === 0 ? 0 : 2}>
            <RadioButton
              name="defender-access"
              id={id}
              label={formatMessage(label)}
              checked={workingCase.requestSharedWithDefender === value}
              onChange={() => {
                setAndSendCaseToServer(
                  [{ requestSharedWithDefender: value, force: true }],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
              disabled={!hasDefender}
            />
          </Box>
        ))}
      </RadioGroup>
    </>
  )
}

export default RequestCaseDefenderSharing
