import React from 'react'
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

export const AvailableElections = () => {
  const { formatMessage } = useLocale()
  const { errors } = useFormContext()
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

  const getOptions = () => {
    return financialStatementsInaoElections.map((option) => {
      return { label: option.name, value: option.electionId }
    })
  }

  return (
    <Box width="full">
      <SelectController
        id={ABOUTIDS.selectElection}
        name={ABOUTIDS.selectElection}
        backgroundColor="blue"
        label={formatMessage(m.election)}
        placeholder={formatMessage(m.pickElectionType)}
        error={errors && getErrorViaPath(errors, ABOUTIDS.selectElection)}
        options={getOptions()}
      />
    </Box>
  )
}
