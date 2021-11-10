import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'
import { User } from 'oidc-client'

interface Props {
  userInfo: User
}

const FinanceBills: FC<Props> = ({ userInfo }) => {
  useNamespaces('sp.finance-bills')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeBills)}
      intro={formatMessage({
        id: 'sp.finance-bills:intro',
        defaultMessage:
          'Hér er að finna greidda og ógreidda greiðsluseðla fyrir valið tímabil. Einnig greiðslukvittanir fyrir greiðslur nema þar sem greiðsluseðill hefur verið greiddur beint í banka.',
      })}
      listPath="billReceipt"
      userInfo={userInfo}
    />
  )
}

export default FinanceBills
