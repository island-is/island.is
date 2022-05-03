import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { BasicInfo } from '@island.is/api/schema'

interface PropTypes {
  data: BasicInfo
}

const BaseInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:basic-info-vehicle',
          defaultMessage: 'Grunnupplýsingar ökutækis',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-model',
            defaultMessage: 'Tegund',
          })}
          value={data.model || ''}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-regno',
            defaultMessage: 'Skráningarnúmer',
          })}
          value={data.regno || ''}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-sub-model',
            defaultMessage: 'Undirtegund',
          })}
          value={data.subModel || ''}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-permno',
            defaultMessage: 'Fastanúmer',
          })}
          value={data.permno || ''}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-verno',
            defaultMessage: 'Verksmiðjunúmer',
          })}
          value={data.verno || ''}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-year',
            defaultMessage: 'Árgerð',
          })}
          value={data.year || ''}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-country',
            defaultMessage: 'Framleiðsluland',
          })}
          value={data.country || ''}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-pre-reg-year',
            defaultMessage: 'Framleiðsluár',
          })}
          value={data.preregDateYear || ''}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-pre-country',
            defaultMessage: 'Fyrra skráningarland',
          })}
          value={data.formerCountry || ''}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:basic-import-status',
            defaultMessage: 'Innflutningsástand',
          })}
          value={data.importStatus || ''}
        />
      </Row>
    </Box>
  )
}

export default BaseInfoItem
