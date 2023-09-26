import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import SelectableList, {
  Item,
} from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import { PoliceCaseInfo } from '@island.is/judicial-system-web/src/graphql/schema'

import { PoliceCase } from '../Defendant'
import { lokeNumberList as strings } from './LokeNumberList.strings'

interface Props {
  isLoading: boolean
  loadingError: boolean
  policeCaseInfo?: PoliceCaseInfo[]
  addPoliceCaseNumbers: (policeCases: PoliceCase[]) => void
}

export const LokeNumberList: React.FC<Props> = (props) => {
  const { isLoading, loadingError, policeCaseInfo, addPoliceCaseNumbers } =
    props
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const [availablePoliceCases, setAvailablePoliceCases] =
    useState<PoliceCaseInfo[]>()

  useEffect(() => {
    if (policeCaseInfo) {
      const available = policeCaseInfo?.filter(
        (caseInfo) =>
          !workingCase.policeCaseNumbers.includes(caseInfo.policeCaseNumber),
      )
      setAvailablePoliceCases(available)
    }
  }, [workingCase, policeCaseInfo])

  const handleCreatePoliceCases = (selectedPoliceCases: Item[]) => {
    const policeCases = selectedPoliceCases.map((policeCase) => {
      const availablePoliceCase = availablePoliceCases?.find(
        (p) => p.policeCaseNumber === policeCase.name,
      )

      return {
        number: availablePoliceCase?.policeCaseNumber || '',
        place: availablePoliceCase?.place || undefined,
        date: availablePoliceCase?.date
          ? new Date(availablePoliceCase.date)
          : undefined,
      }
    })

    addPoliceCaseNumbers(policeCases)
  }

  return (
    <Box marginBottom={5}>
      <SelectableList
        items={availablePoliceCases?.map((availablePoliceCase) => ({
          id: availablePoliceCase.policeCaseNumber,
          name: availablePoliceCase.policeCaseNumber,
        }))}
        CTAButton={{
          label: formatMessage(strings.selectNumbersButton),
          onClick: handleCreatePoliceCases,
        }}
        isLoading={isLoading}
        errorMessage={
          loadingError ? formatMessage(strings.errorMessage) : undefined
        }
        successMessage={
          availablePoliceCases?.length === 0
            ? formatMessage(strings.allNumbersSelected)
            : undefined
        }
      />
    </Box>
  )
}
