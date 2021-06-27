import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Table as T, Icon } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'
import { Endorsement } from '../../types/schema'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

interface EndorsementTableProps {
  application: Application
  endorsements?: Endorsement[]
}

const EndorsementTable: FC<EndorsementTableProps> = ({ endorsements }) => {
  const { formatMessage } = useLocale()
  const withBulkImport = endorsements?.some((x) => x.meta.bulkEndorsement)
  const renderRow = (endorsement: Endorsement) => {
    const fullAddress =
      endorsement.meta.address.streetAddress +
      ', ' +
      endorsement.meta.address.postalCode +
      ' ' +
      endorsement.meta.address.city
    const rowBackground = endorsement.meta.bulkEndorsement
      ? 'roseTinted100'
      : 'white'
    return (
      <T.Row key={endorsement.id}>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {formatDate(endorsement.created)}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {endorsement.meta.fullName}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {formatKennitala(endorsement.endorser)}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
            textAlign: 'right',
          }}
        >
          {fullAddress}
        </T.Data>
        {withBulkImport && (
          <T.Data
            box={{
              background: rowBackground,
              textAlign: 'right',
            }}
          >
            {endorsement.meta.bulkEndorsement && (
              <Icon icon="attach" color="blue400" />
            )}
          </T.Data>
        )}
      </T.Row>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(m.endorsementTable.thDate)}</T.HeadData>
          <T.HeadData>{formatMessage(m.endorsementTable.thName)}</T.HeadData>
          <T.HeadData>
            {formatMessage(m.endorsementTable.thNationalNumber)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {formatMessage(m.endorsementTable.thAddress)}
          </T.HeadData>
          {withBulkImport && <T.HeadData></T.HeadData>}
        </T.Row>
      </T.Head>
      <T.Body>
        {!!endorsements?.length &&
          endorsements.map((endorsements) => renderRow(endorsements))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
