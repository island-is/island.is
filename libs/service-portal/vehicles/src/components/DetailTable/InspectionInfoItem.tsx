import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { InspectionInfo } from '@island.is/api/schema'

interface PropTypes {
  data: InspectionInfo
}

const InspectionInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:insp-title',
          defaultMessage: 'Skoðun og gjöld',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-type',
            defaultMessage: 'Tegund skoðunar',
          })}
          value={data.type}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-date',
            defaultMessage: 'Dagsetning',
          })}
          value={data.date && new Date(data.date).toLocaleDateString()}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-result',
            defaultMessage: 'Niðurstaða',
          })}
          value={data.result}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-plate-status',
            defaultMessage: 'Staða plötu',
          })}
          value={data.plateStatus}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-taxes',
            defaultMessage: 'Bifreiðagjöld',
          })}
          value={null}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-insured',
            defaultMessage: 'Tryggt',
          })}
          value={
            null
            // ? formatMessage({
            //     id: 'sp.vehicles:insp-insured-yes',
            //     defaultMessage: 'Já',
            //   })
            // : formatMessage({
            //     id: 'sp.vehicles:insp-insured-no',
            //     defaultMessage: 'Nei',
            //   })
          }
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-next-insp',
            defaultMessage: 'Næsta aðalskoðun',
          })}
          value={
            data.nextInspectionDate &&
            new Date(data.nextInspectionDate).toLocaleDateString()
          }
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-last-insp',
            defaultMessage: 'Síðasta skoðun',
          })}
          value={
            data.lastInspectionDate &&
            new Date(data.lastInspectionDate).toLocaleDateString()
          }
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-mortages',
            defaultMessage: 'Veðbönd',
          })}
          value={null}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-negligence',
            defaultMessage: 'Vanrækslugjald',
          })}
          value={null}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-plate-location',
            defaultMessage: 'Geymslustaður',
          })}
          value={null}
        />
      </Row>
    </Box>
  )
}

export default InspectionInfoItem
