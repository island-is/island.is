import React, { FC } from 'react'

import { useLocale, withClientLocale } from '@island.is/localization'
import { m, DynamicWrapper } from '@island.is/service-portal/core'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const LocalTax: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <DynamicWrapper>
      <DocumentScreen
        title={formatMessage(m.financeLocalTax)}
        intro={formatMessage({
          id: 'sp.local-tax:intro',
          defaultMessage:
            'Sýnir þá staðgreiðslu sem skilað er til sveitafélaga.',
        })}
        listPath="localTax"
        defaultDateRangeMonths={12}
      />
    </DynamicWrapper>
  )
}

export default withClientLocale('sp.local-tax')(LocalTax)
