import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Endorsement } from '../../types/schema'
import { Box, Table as T, Tooltip } from '@island.is/island-ui/core'
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
    return (
      <T.Row key={endorsement.id}>
        <T.Data>{formatDate(endorsement.created)}</T.Data>
        <T.Data>{endorsement.meta.fullName}</T.Data>
        <T.Data>{formatKennitala(endorsement.endorser)}</T.Data>
        <T.Data
          key={endorsement.id}
          box={{
            background: endorsement.meta.invalidated ? 'yellow200' : 'white',
            textAlign: 'right',
          }}
        >
          {endorsement.meta.invalidated ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {endorsement.meta.address.streetAddress}
              <Box marginLeft={2}>
                <Tooltip
                  color="blue400"
                  iconSize="medium"
                  text={formatMessage(m.validationMessages.signatureInvalid)}
                />
              </Box>
            </Box>
          ) : (
            endorsement.meta.address.streetAddress
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
        {!!endorsements?.length &&
          endorsements.map((endorsements) => renderRow(endorsements))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
