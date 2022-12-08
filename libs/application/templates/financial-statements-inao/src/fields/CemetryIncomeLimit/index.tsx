import React, { useEffect } from 'react'
import { AlertMessage, ContentBlock } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'

import { getFinancialLimit } from '../../graphql'
import { CEMETRYOPERATIONIDS } from '../../lib/constants'
import { FSIUSERTYPE } from '../../types'

export const CemeteryIncomeLimit = ({
  currentUserType,
}: {
  currentUserType?: FSIUSERTYPE
}) => {
  const { getValues, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const values = getValues()
  const year: string = values?.conditionalAbout?.operatingYear

  const { data, error } = useQuery(getFinancialLimit, {
    variables: { input: { year, clientType: currentUserType?.toString() } },
  })

  useEffect(() => {
    const limit = data?.financialStatementsInaoClientFinancialLimit?.toString()
    if (limit) {
      setValue(CEMETRYOPERATIONIDS.incomeLimit, limit)
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
