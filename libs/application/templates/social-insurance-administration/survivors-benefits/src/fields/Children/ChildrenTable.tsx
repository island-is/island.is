import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Table } from '@island.is/application/ui-components'
import { getApplicationExternalData } from '../../lib/survivorsBenefitsUtils'
import { format as formatKennitala } from 'kennitala'

interface ChildrenTableProps {
  application: Application
}

const ChildrenTable: FC<ChildrenTableProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { children } = getApplicationExternalData(application.externalData)

  const data =
    children.map((child) => {
      return {
        fullName: child.fullName,
        nationalId: formatKennitala(child.nationalId),
      }
    }) ?? []

  const columns = [
    {
      Header: formatText(
        socialInsuranceAdministrationMessage.confirm.name,
        application,
        formatMessage,
      ),
      accessor: 'fullName',
    } as const,
    {
      Header: formatText(
        socialInsuranceAdministrationMessage.confirm.nationalId,
        application,
        formatMessage,
      ),
      accessor: 'nationalId',
    } as const,
  ]

  return <Table columns={columns} data={data} />
}

export default ChildrenTable
