import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Endorsement } from '../../lib/dataSchema'
import { Box, Table as T, Tooltip, Icon } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'

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
  const renderRow = (endorsement: Endorsement) => {
    const rowBackground = endorsement.bulkImported
      ? 'blue200'
      : endorsement.hasWarning
      ? 'yellow200'
      : 'white'
    return (
      <T.Row key={endorsement.id}>
        <T.Data
          key={endorsement.id + endorsement.date}
          box={{
            background: rowBackground
          }}
        >
          {formatDate(endorsement.date)}
        </T.Data>
        <T.Data
          key={endorsement.id + endorsement.name}
          box={{
            background: rowBackground
          }}
        >
          {endorsement.name}
        </T.Data>
        <T.Data
          key={endorsement.id + endorsement.nationalId}
          box={{
            background: rowBackground
          }}
        >
          {formatKennitala(endorsement.nationalId)}
        </T.Data>
        <T.Data
          key={endorsement.id}
          box={{
            background: rowBackground,
            textAlign: 'right',
          }}
        >
          {endorsement.hasWarning || endorsement.bulkImported ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {endorsement.address}
              <Box marginLeft={2}>
                {endorsement.hasWarning && (
                  <Tooltip
                    color="blue400"
                    iconSize="medium"
                    text={formatMessage(m.validationMessages.signatureInvalid)}
                  />
                )}
                {endorsement.bulkImported && (
                  <Icon icon="attach" color="blue400" />
                )}
              </Box>
            </Box>
          ) : (
            endorsement.address
          )}
        </T.Data>
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
        </T.Row>
      </T.Head>
      <T.Body>
        {endorsements &&
          endorsements.length &&
          endorsements.map((endorsements) => renderRow(endorsements))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
