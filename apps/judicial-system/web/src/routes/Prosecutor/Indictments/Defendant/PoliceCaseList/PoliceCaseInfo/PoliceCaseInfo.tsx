import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import {
  FormContext,
  Item,
  SelectableList,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  PoliceCaseInfo as TPoliceCaseInfo,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { usePoliceCaseInfoQuery } from './policeCaseInfo.generated'
import { strings } from './PoliceCaseInfo.strings'

interface Props {
  onPoliceCaseInfoLoaded: (policeCaseInfo: TPoliceCaseInfo[]) => void
  onAddPoliceCaseInfo: (policeCaseInfo: TPoliceCaseInfo[]) => void
}

export const PoliceCaseInfo: FC<Props> = ({
  onPoliceCaseInfoLoaded,
  onAddPoliceCaseInfo,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const { data, loading, error } = usePoliceCaseInfoQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (!data.policeCaseInfo) {
        return
      }

      onPoliceCaseInfoLoaded(data.policeCaseInfo)
    },
  })

  const policeCaseInfo = useMemo(() => {
    if (!data || !data.policeCaseInfo) {
      return []
    }

    // Sort modifies an array in place, so we create a copy first
    const sorted = [...data.policeCaseInfo].sort((a, b) => {
      const aDate = a.date
      const bDate = b.date

      // We want missing dates to be at the end of the list
      if (aDate === undefined || aDate === null) {
        return bDate === undefined || bDate === null ? 0 : 1
      }

      if (bDate === undefined || bDate === null) {
        return -1
      }

      return aDate !== bDate ? (aDate < bDate ? -1 : 1) : 0
    })

    return sorted
  }, [data])

  const availablePoliceCases = useMemo(() => {
    return policeCaseInfo.filter(
      (caseInfo) =>
        !workingCase.policeCaseNumbers?.includes(caseInfo.policeCaseNumber),
    )
  }, [policeCaseInfo, workingCase.policeCaseNumbers])

  const handleAddPoliceCaseInfo = (selectedItems: Item[]) => {
    const policeCases = selectedItems.flatMap((item) => {
      const policeCase = availablePoliceCases?.find(
        (p) => p.policeCaseNumber === item.name,
      )

      return policeCase ? [policeCase] : []
    })

    onAddPoliceCaseInfo(policeCases)
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
          onClick: handleAddPoliceCaseInfo,
        }}
        isLoading={loading}
        errorMessage={error ? formatMessage(strings.errorMessage) : undefined}
        successMessage={
          availablePoliceCases?.length === 0
            ? formatMessage(strings.allNumbersSelected)
            : undefined
        }
      />
    </Box>
  )
}
