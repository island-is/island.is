import { useCallback, useMemo, useReducer } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { getAvailableElections } from '../../graphql'
import { FinancialStatementsInaoElection } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { ABOUTIDS, UPDATE_ELECTION_ACTION } from '../../utils/constants'
import { electionInitialState, electionReducer } from './electionReducer'
import { Options } from '../../types/types'
import { ElectionSelect } from './ElectionSelect'
import { IncomeLimitFields } from './IncomeLimitFields'
import { m } from '../../lib/messages'

export const ElectionsInfoFields = () => {
  const [state, dispatch] = useReducer(electionReducer, electionInitialState)
  const { getValues, setValue } = useFormContext()
  const values = getValues()
  const { data, loading, error } = useQuery(getAvailableElections)

  const { formatMessage } = useLocale()

  const financialStatementsInaoElections: FinancialStatementsInaoElection[] =
    useMemo(
      () => data?.financialStatementsInaoElections,
      [data?.financialStatementsInaoElections],
    )

  const options: Options = useMemo(
    () =>
      financialStatementsInaoElections?.map((option) => {
        return { label: option.name, value: option.electionId }
      }),
    [financialStatementsInaoElections],
  )

  const defaultElections = options?.[0]?.value

  const getElectionInfo = useCallback(
    (selectedElectionId: string | undefined) => {
      const currentElectionInfo = financialStatementsInaoElections?.find(
        (elections: FinancialStatementsInaoElection) =>
          elections.electionId === selectedElectionId,
      )
      const electionYear = currentElectionInfo?.electionDate
        ? new Date(currentElectionInfo.electionDate).getFullYear()
        : ''

      const electionName = currentElectionInfo?.name
      const genitiveName = currentElectionInfo?.genitiveName
      setValue(ABOUTIDS.electionName, electionName)
      setValue(ABOUTIDS.genitiveName, genitiveName)
      dispatch({
        type: UPDATE_ELECTION_ACTION,
        payload: {
          name: electionName,
          year: electionYear.toString(),
        },
      })
    },
    [financialStatementsInaoElections, setValue],
  )

  const getDefaultElection = useCallback(() => {
    const selectedElectionId =
      values?.election?.selectElection || defaultElections

    const currentElection = options?.find(
      (option) => option.value === selectedElectionId,
    )
    getElectionInfo(currentElection?.value)

    return currentElection?.label || ''
  }, [
    defaultElections,
    values?.election?.selectElection,
    options,
    getElectionInfo,
  ])

  return (
    <>
      <ElectionSelect
        defaultElections={defaultElections}
        getDefaultElection={getDefaultElection}
        getElectionInfo={getElectionInfo}
        financialStatementsInaoElections={financialStatementsInaoElections}
        options={options}
        loading={loading}
        error={error}
      />
      <Box paddingTop={4} paddingBottom={3}>
        <Text variant="h3">{formatMessage(m.campaignCost)}</Text>
        <Text>{formatMessage(m.pleaseSelect)}</Text>
      </Box>
      <IncomeLimitFields year={state.year} />
    </>
  )
}
