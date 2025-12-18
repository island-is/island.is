import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'
import {
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { useConnectedCasesQuery } from './connectedCases.generated'
import { strings } from './SelectConnectedCase.strings'

type ConnectedCaseOption = ReactSelectOption & { connectedCase: Case }

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  mergeCaseNumber?: string | null
}

const SelectConnectedCase: FC<Props> = ({
  workingCase,
  setWorkingCase,
  mergeCaseNumber,
}) => {
  const { formatMessage } = useIntl()

  const { data: connectedCasesData, loading: connectedCasesLoading } =
    useConnectedCasesQuery({
      variables: {
        input: {
          id: workingCase.id,
        },
      },
    })

  const setConnectedCase = async (connectedCaseId: string | null) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      mergeCase: connectedCaseId ? { id: connectedCaseId } : null,
    }))
  }

  const connectedCases = connectedCasesData?.connectedCases
    ?.filter(
      // The filtering is done here rather than on the server side
      // as we may allow more relaxed merging later on
      (connectedCase) =>
        connectedCase.defendants?.length === 1 &&
        connectedCase.court?.id === workingCase.court?.id,
    )
    ?.map((connectedCase) => ({
      label: `${connectedCase.courtCaseNumber}`,
      value: connectedCase.id,
    })) as ConnectedCaseOption[]

  // For now we only want to allow cases with a single defendant to be able to merge
  // in to another case
  const mergeAllowed = workingCase.defendants?.length === 1

  const defaultConnectedCase = connectedCases?.find(
    (connectedCase) =>
      workingCase.mergeCase &&
      connectedCase.value === workingCase.mergeCase?.id,
  )

  if (!mergeAllowed) {
    return (
      <AlertMessage
        type="warning"
        title={formatMessage(strings.cannotBeMergedTitle)}
        message={formatMessage(strings.cannotBeMergedMessage)}
      />
    )
  } else if (connectedCasesLoading) {
    return (
      <Box
        textAlign="center"
        paddingY={2}
        paddingX={3}
        marginBottom={2}
        key="loading-dots"
      >
        <LoadingDots />
      </Box>
    )
  } else {
    return connectedCases.length === 0 ? (
      <AlertMessage
        type="warning"
        message={formatMessage(strings.noConnectedCasesMessage)}
      />
    ) : (
      <Select
        name="connectedCase"
        label={formatMessage(strings.connectedCaseLabel)}
        options={connectedCases}
        value={defaultConnectedCase}
        placeholder={formatMessage(strings.connectedCasePlaceholder)}
        onChange={(selectedOption) => {
          setConnectedCase((selectedOption?.value as string) || null)
        }}
        isDisabled={
          connectedCasesLoading ||
          Boolean(mergeCaseNumber) ||
          workingCase.state === CaseState.CORRECTING
        }
        isClearable
      />
    )
  }
}

export default SelectConnectedCase
