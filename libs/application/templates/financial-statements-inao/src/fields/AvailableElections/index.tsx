import React, { Fragment, useEffect } from 'react'
import {
  AlertMessage,
  Box,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ABOUTIDS } from '../../lib/constants'
import { useQuery } from '@apollo/client'
import getAvailableElections from '../../graphql'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { FinancialStatementsInaoElection } from '@island.is/api/schema'
import { ElectionSelectProps } from '../../lib/utils/types'

const ElectionSelect = ({
  defaultElections,
  getDefaultElectionName,
  options,
}: ElectionSelectProps) => {
  const { formatMessage } = useLocale()
  const { errors, setValue } = useFormContext()

  useEffect(() => {
    const electionName = getDefaultElectionName()
    setValue(ABOUTIDS.electionName, electionName)
  }, [])

  return (
    <Box width="full">
      <SelectController
        id={ABOUTIDS.selectElection}
        name={ABOUTIDS.selectElection}
        onSelect={(val) => {
          setValue(ABOUTIDS.electionName, val.label)
        }}
        backgroundColor="blue"
        label={formatMessage(m.election)}
        placeholder={formatMessage(m.pickElectionType)}
        error={errors && getErrorViaPath(errors, ABOUTIDS.selectElection)}
        options={options}
        defaultValue={defaultElections}
      />
    </Box>
  )
}

export const AvailableElections = () => {
  const { formatMessage } = useLocale()

  const { getValues } = useFormContext()
  const values = getValues()

  const { data, loading, error } = useQuery(getAvailableElections)

  if (error) {
    return (
      <ContentBlock>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={formatMessage(m.fetchErrorMsg)}
        />
      </ContentBlock>
    )
  }

  if (loading) {
    return <SkeletonLoader height={70} width="100%" borderRadius="large" />
  }

  const financialStatementsInaoElections: FinancialStatementsInaoElection[] =
    data.financialStatementsInaoElections

  const options = financialStatementsInaoElections.map((option) => {
    return { label: option.name, value: option.electionId }
  })

  const defaultElections = options?.[0]?.value

  const getDefaultElectionName = () => {
    const selectedElectionId =
      values.election.selectElection || defaultElections
    const electionName = options?.find(
      (option) => option.value === selectedElectionId,
    )
    return electionName?.label || ''
  }

  return (
    <Fragment>
      <ElectionSelect
        defaultElections={defaultElections}
        getDefaultElectionName={getDefaultElectionName}
        options={options}
      />
    </Fragment>
  )
}
