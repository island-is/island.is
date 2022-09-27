import React, { ReactText, useEffect } from 'react'
import {
  AlertMessage,
  Box,
  ContentBlock,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { ApolloError } from '@apollo/client/errors'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { ABOUTIDS } from '../../lib/constants'
import { useFormContext } from 'react-hook-form'
import { Options } from '../../lib/utils/types'
import { FinancialStatementsInaoElection } from '../../types/schema'

export type ElectionSelectProps = {
  defaultElections: string
  error?: ApolloError
  financialStatementsInaoElections: FinancialStatementsInaoElection[]
  getDefaultElection: () => string
  getElectionInfo: (electionId: ReactText | undefined) => void
  loading: boolean
  options: Options
}

export const ElectionSelect = ({
  defaultElections,
  error,
  financialStatementsInaoElections,
  getDefaultElection,
  getElectionInfo,
  loading,
  options,
}: ElectionSelectProps) => {
  const { formatMessage } = useLocale()
  const { errors, setValue } = useFormContext()

  useEffect(() => {
    getDefaultElection()
  }, [getDefaultElection])

  if (loading) {
    return <SkeletonLoader height={70} width="100%" borderRadius="large" />
  }

  if (error || financialStatementsInaoElections?.length <= 0) {
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

  return (
    <Box width="full">
      <SelectController
        id={ABOUTIDS.selectElection}
        name={ABOUTIDS.selectElection}
        onSelect={(val) => {
          setValue(ABOUTIDS.electionName, val.label)
          getElectionInfo(val.value)
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
