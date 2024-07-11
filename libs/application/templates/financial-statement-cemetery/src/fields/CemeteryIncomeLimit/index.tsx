import React, { useEffect } from 'react'
import { AlertMessage, ContentBlock } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'

import { financialLimitQuery } from '../../graphql'

import { FSIUSERTYPE } from '../../types'
import { CEMETERYOPERATIONIDS } from '../../utils/constants'

export const CemeteryIncomeLimit = ({
  currentUserType,
}: {
  currentUserType?: FSIUSERTYPE
}) => {
  const { getValues, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const values = getValues()
  const year: string = values?.conditionalAbout?.operatingYear

  const { data, error } = useQuery(financialLimitQuery, {
    variables: { input: { year, clientType: `${FSIUSERTYPE.CEMETRY}` } },
  })

  useEffect(() => {
    const limit =
      data?.financialStatementCemeteryClientFinancialLimit?.toString()
    if (limit) {
      setValue(CEMETERYOPERATIONIDS.incomeLimit, limit)
    }
  }, [data, setValue])

  if (error) {
    return (
      <ContentBlock>
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchErrorTitle)}
          message={formatMessage(m.fetchCemetryLimitErrorMsg)}
        />
      </ContentBlock>
    )
  }

  return null
}
