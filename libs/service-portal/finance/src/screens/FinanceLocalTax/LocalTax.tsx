import React, { FC } from 'react'

import { useLocale, useNamespaces } from '@island.is/localization'
import { m, DynamicWrapper } from '@island.is/service-portal/core'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const LocalTax: FC<React.PropsWithChildren<unknown>> = () => {
  useNamespaces('sp.local-tax')
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

export default LocalTax
