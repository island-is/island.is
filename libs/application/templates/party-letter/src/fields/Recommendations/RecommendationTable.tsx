import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

import { Signature } from '../../types'
import { Box, Table as T, Icon } from '@island.is/island-ui/core'

interface RecommendationProps {
  application: Application
  signatures?: Signature[]
}

const RecommendationTable: FC<RecommendationProps> = ({
  application,
  signatures,
}) => {
  const { formatMessage } = useLocale()

  const renderRow = (signature: Signature) => {
    const cell = Object.entries(signature)

    return (
      <T.Row>
        {cell.map(([key, value]) => {
          console.log(key, value, signature.hasWarning)
          if (typeof value === 'string')
            return (
              <T.Data
                box={{
                  background: signature.hasWarning ? 'yellow200' : 'white',
                  textAlign: value === signature.address ? 'right' : 'left',
                  overflow: signature.hasWarning ? 'visible' : undefined,
                  position: 'relative',
                }}
              >
                {value}
              </T.Data>
            )
        })}
      </T.Row>
    )
  }

  return (
    <T.Table box={{ overflow: 'visible' }}>
      <T.Head>
        <T.Row>
          <T.HeadData>Dags skráðkóli</T.HeadData>
          <T.HeadData>Nafn</T.HeadData>
          <T.HeadData>Kennitala</T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>Heimilisfang</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {signatures &&
          signatures.length &&
          signatures.map((signature) => renderRow(signature))}
      </T.Body>
    </T.Table>
  )
}

export default RecommendationTable
