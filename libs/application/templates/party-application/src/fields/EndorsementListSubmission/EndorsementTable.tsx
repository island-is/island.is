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
import { Endorsement } from '../../lib/dataSchema'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

interface EndorsementTableProps {
  endorsements: Endorsement[]
  selectedEndorsements: Endorsement[]
  onChange: (endorsement: Endorsement) => void
  disabled: boolean
}

const EndorsementTable: FC<EndorsementTableProps> = ({
  endorsements,
  selectedEndorsements,
  onChange,
  disabled,
}) => {
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
            background: rowBackground,
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
                  text={formatMessage(
                    m.endorsementListSubmission.invalidEndorsement,
                  )}
                />
                {endorsement.bulkImported && (
                  <Icon icon="attach" color="blue400" />
                )}
              </Box>
            </Box>
          ) : (
            endorsement.address
          )}
        </T.Data>
        <T.Data
          box={{
            background: rowBackground,
          }}
        >
          <Checkbox
            disabled={disabled}
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
