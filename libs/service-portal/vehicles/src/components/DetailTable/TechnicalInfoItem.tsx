import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { Axle, TechnicalInfo } from '@island.is/api/schema'

interface PropTypes {
  data: TechnicalInfo
}

const TechnicalInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:tech-title',
          defaultMessage: 'Tæknilegar upplýsingar',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-engine',
            defaultMessage: 'Vélargerð',
          })}
          value={data.engine}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-vehicleWeight',
            defaultMessage: 'Eiginþyngd',
          })}
          value={data.vehicleWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-slagrymi',
            defaultMessage: 'Slagrými',
          })}
          value={data.cubicCapacity + ' cc.'}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-capacity-weight',
            defaultMessage: 'Þyngd vagnlestar',
          })}
          value={data.capacityWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-length',
            defaultMessage: 'Lengd',
          })}
          value={data.length + ' mm'}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-total-weight',
            defaultMessage: 'Heildarþyngd',
          })}
          value={data.totalWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-width',
            defaultMessage: 'Breidd',
          })}
          value={data.width + ' mm'}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-trailer-without-brakes',
            defaultMessage: 'Óhemlaður eftirvagn',
          })}
          value={data.trailerWithoutBrakesWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-horsepower',
            defaultMessage: 'Afl (hö)',
          })}
          value={data.horsepower && data.horsepower + ' hö'}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-trailer-with-brakes',
            defaultMessage: 'Hemlaður eftirvagn',
          })}
          value={data.trailerWithBrakesWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-carrying-capacity',
            defaultMessage: 'Burðargeta',
          })}
          value={data.carryingCapacity + ' kg'}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:tech-axle-total-weight',
            defaultMessage: 'Leyfð ásþyngd',
          })}
          value={data.axleTotalWeight ? data.axleTotalWeight + ' kg' : ''}
        />
      </Row>
      {data.axle?.map((item: Axle | null, index: number) => {
        const axleTitle = formatMessage({
          id: 'sp.vehicles:tech-axle-1',
          defaultMessage: 'Ás',
        })
        const axleWheel = formatMessage({
          id: 'sp.vehicles:tech-axle-wheel',
          defaultMessage: 'Stærð hjólbarða',
        })
        return (
          <Row key={'Axle: ' + index}>
            <Column label={axleTitle} value={index + 1} />
            <Column label={axleWheel} value={item?.wheelAxle} />
          </Row>
        )
      })}
    </Box>
  )
}

export default TechnicalInfoItem
