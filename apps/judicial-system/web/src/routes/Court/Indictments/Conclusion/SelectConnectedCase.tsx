import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { useConnectedCasesQuery } from './connectedCases.generated'
import { strings } from './SelectConnectedCase.strings'

type ConnectedCaseOption = ReactSelectOption & { connectedCase: Case }

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const SelectConnectedCase: FC<Props> = ({ workingCase, setWorkingCase }) => {
  const { formatMessage } = useIntl()

  const { data: connectedCasesData, loading: connectedCasesLoading } =
    useConnectedCasesQuery({
      variables: {
        input: {
          id: workingCase.id,
        },
      },
    })

  const setConnectedCase = async (connectedCaseId: string) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      mergeCase: {
        id: connectedCaseId,
      },
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
  const mergeAllowed = workingCase.defendants?.length === 1 ? true : false

  const defaultConnectedCase = connectedCases?.find(
    (connectedCase) =>
      workingCase.mergeCase &&
      connectedCase.value === workingCase.mergeCase?.id,
  )

  return !mergeAllowed ? (
    <AlertMessage
      type={'warning'}
      title={formatMessage(strings.cannotBeMergedTitle)}
      message={formatMessage(strings.cannotBeMergedMessage)}
    />
  ) : connectedCasesLoading ? (
    <Box
      textAlign="center"
      paddingY={2}
      paddingX={3}
      marginBottom={2}
      key="loading-dots"
    >
      <LoadingDots />
    </Box>
  ) : connectedCases?.length === 0 ? (
    <AlertMessage
      type={'warning'}
      title={formatMessage(strings.noConnectedCasesTitle)}
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
        if (!selectedOption) {
          return
        }
        setConnectedCase(selectedOption.value as string)
      }}
      isDisabled={connectedCasesLoading}
    />
  )
}

export default SelectConnectedCase
