import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Endorsement } from '../../lib/dataSchema'
import { Box, Table as T, Tooltip, Text } from '@island.is/island-ui/core'
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
    const rowBackground = endorsement.hasWarning ? 'yellow200' : 'white'
    return (
      <T.Row key={endorsement.id}>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {formatDate(endorsement.date)}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {endorsement.name}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          {formatKennitala(endorsement.nationalId)}
        </T.Data>
        <T.Data
          box={{
            background: endorsement.hasWarning ? 'yellow200' : 'white',
            textAlign: 'right',
          }}
        >
          {endorsement.hasWarning ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {endorsement.address}
              <Box marginLeft={2}>
                <Tooltip
                  color="blue400"
                  iconSize="medium"
                  text={formatMessage(m.endorsementList.signatureInvalid)}
                />
              </Box>
            </Box>
          ) : (
            <Text>{endorsement.address}</Text>
          )}
        </T.Data>
      </T.Row>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(m.endorsementList.thDate)}</T.HeadData>
          <T.HeadData>{formatMessage(m.endorsementList.thName)}</T.HeadData>
          <T.HeadData>
            {formatMessage(m.endorsementList.thNationalNumber)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {formatMessage(m.endorsementList.thAddress)}
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
