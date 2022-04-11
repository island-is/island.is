import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'

interface PropTypes {
  data: any
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
          value={data.date}
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
          value={data.carTaxes}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-insured',
            defaultMessage: 'Tryggt',
          })}
          value={
            data.insuranceStatus
              ? formatMessage({
                  id: 'sp.vehicles:insp-insured-yes',
                  defaultMessage: 'Já',
                })
              : formatMessage({
                  id: 'sp.vehicles:insp-insured-no',
                  defaultMessage: 'Nei',
                })
          }
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-next-insp',
            defaultMessage: 'Næsta aðalskoðun',
          })}
          value={data.nextInspectionDate}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:insp-last-insp',
            defaultMessage: 'Síðasta skoðun',
          })}
          value={data.lastInspectionDate}
        />
      </Row>
      {(data.mortages || data.negligenceFee) && (
        <Row>
          <Column
            label={formatMessage({
              id: 'sp.vehicles:insp-mortages',
              defaultMessage: 'Veðbönd',
            })}
            value={data.mortages}
          />
          <Column
            label={formatMessage({
              id: 'sp.vehicles:insp-negligence',
              defaultMessage: 'Vanrækslugjald',
            })}
            value={data.negligenceFee}
          />
        </Row>
      )}
      {data.plateLocation && (
        <Row>
          <Column
            label={formatMessage({
              id: 'sp.vehicles:insp-plate-location',
              defaultMessage: 'Geymslustaður',
            })}
            value={data.plateLocation}
          />
        </Row>
      )}
    </Box>
  )
}

export default InspectionInfoItem
