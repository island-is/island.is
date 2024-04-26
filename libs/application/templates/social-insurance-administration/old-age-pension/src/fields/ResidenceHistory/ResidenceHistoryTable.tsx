import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { Table } from '@island.is/application/ui-components'
import {
  getApplicationExternalData,
  getCombinedResidenceHistory,
} from '../../lib/oldAgePensionUtils'
import { getCountryByCode } from '@island.is/shared/utils'

interface ResidenceHistoryTableProps {
  application: Application
}

const ResidenceHistoryTable: FC<ResidenceHistoryTableProps> = ({
  application,
}) => {
  const { lang, formatMessage } = useLocale()
  const { residenceHistory } = getApplicationExternalData(
    application.externalData,
  )

  const combinedResidenceHistory = getCombinedResidenceHistory(
    [...residenceHistory].reverse(),
  )

  const data =
    combinedResidenceHistory.map((history) => {
      return {
        country:
          lang === 'is'
            ? getCountryByCode(history.country)?.name_is
            : getCountryByCode(history.country)?.name,
        periodFrom: new Date(history.periodFrom).toLocaleDateString(),
        periodTo:
          history.periodTo !== '-'
            ? new Date(history.periodTo).toLocaleDateString()
            : '-',
      }
    }) ?? []

  const columns = [
    {
      Header: formatText(
        oldAgePensionFormMessage.residence.residenceHistoryCountryTableHeader,
        application,
        formatMessage,
      ),
      accessor: 'country',
    } as const,
    {
      Header: formatText(
        oldAgePensionFormMessage.residence
          .residenceHistoryPeriodFromTableHeader,
        application,
        formatMessage,
      ),
      accessor: 'periodFrom',
    } as const,
    {
      Header: formatText(
        oldAgePensionFormMessage.residence.residenceHistoryPeriodToTableHeader,
        application,
        formatMessage,
      ),
      accessor: 'periodTo',
    } as const,
  ]

  return <Table columns={columns} data={data} />
}

export default ResidenceHistoryTable
