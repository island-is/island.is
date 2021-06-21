import React, { FC } from 'react'
import {
  Box,
  Table as T,
  Tooltip,
  Checkbox,
  Icon,
} from '@island.is/island-ui/core'
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
  endorsements?: Endorsement[]
  selectedEndorsements?: Endorsement[]
  onChange: (endorsement: Endorsement) => void
}

const EndorsementTable: FC<EndorsementTableProps> = ({
  endorsements,
  selectedEndorsements,
  onChange,
}) => {
  const { formatMessage } = useLocale()

  const renderRow = (endorsement: Endorsement) => {
    const rowBackground = endorsement.meta.invalidated
      ? 'yellow200'
      : endorsement.meta.bulkEndorsement
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
          {endorsement.meta.invalidated || endorsement.meta.bulkEndorsement ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {endorsement.meta.address.streetAddress}
              <Box marginLeft={2}>
                {endorsement.meta.invalidated && (
                  <Tooltip
                    color="blue400"
                    iconSize="medium"
                    text={formatMessage(
                      m.endorsementListSubmission.invalidEndorsement,
                    )}
                  />
                )}
                {endorsement.meta.bulkEndorsement && (
                  <Icon icon="attach" color="blue400" />
                )}
              </Box>
            </Box>
          ) : (
            endorsement.meta.address.streetAddress
          )}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          <Checkbox
            checked={selectedEndorsements?.some((e) => e.id === endorsement.id)}
            onChange={() => onChange(endorsement)}
          />
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
          <T.HeadData></T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {endorsements &&
          endorsements.length &&
          endorsements.map((endorsement) => renderRow(endorsement))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
