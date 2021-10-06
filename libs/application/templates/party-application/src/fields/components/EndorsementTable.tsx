import React from 'react'
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
import { Application } from '@island.is/application/core'
import { constituencyMapper, EndorsementListTags } from '../../constants'

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
  selectedEndorsements?: Endorsement[]
  onTableSelect?: (endorsement: Endorsement) => void
}

export const EndorsementTable = ({
  application,
  endorsements,
  selectedEndorsements,
  onTableSelect,
}: EndorsementTableProps) => {
  const { formatMessage } = useLocale()
  const withBulkImport = endorsements?.some((x) => x.meta.bulkEndorsement)
  const renderRow = (endorsement: Endorsement) => {
    const voterRegionMismatch =
      endorsement.meta.voterRegion?.voterRegionNumber !==
      constituencyMapper[
        application.answers.constituency as EndorsementListTags
      ].region_number
    const rowBackground = voterRegionMismatch
      ? 'yellow200'
      : endorsement.meta.bulkEndorsement
      ? 'roseTinted100'
      : 'white'
    const fullAddress = `${endorsement.meta.address.streetAddress ?? ''}, ${
      endorsement.meta.address.postalCode ?? ''
    } ${endorsement.meta.address.city ?? ''}`

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
          {voterRegionMismatch ? (
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
              {fullAddress}
              <Box marginLeft={2}>
                {voterRegionMismatch && (
                  <Tooltip
                    color="blue400"
                    iconSize="medium"
                    text={formatMessage(
                      m.endorsementListSubmission.invalidEndorsement,
                    )}
                  />
                )}
              </Box>
            </Box>
          ) : (
            fullAddress
          )}
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
        {onTableSelect && (
          <T.Data
            box={{
              background: rowBackground,
            }}
          >
            <Checkbox
              checked={selectedEndorsements?.some(
                (e) => e.id === endorsement.id,
              )}
              onChange={() => onTableSelect(endorsement)}
            />
          </T.Data>
        )}
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
          {withBulkImport && <T.HeadData></T.HeadData>}
          {onTableSelect && <T.HeadData></T.HeadData>}
        </T.Row>
      </T.Head>
      <T.Body>
        {!!endorsements?.length &&
          endorsements.map((endorsement) => renderRow(endorsement))}
      </T.Body>
    </T.Table>
  )
}
