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
  const renderRow = (signature: Signature, index: number) => {
    const cell = Object.entries(signature)
    return (
      <T.Row key={index}>
        {cell.map(([_key, value], i) => {
          if (typeof value === 'string')
            return (
              <T.Data
                key={i}
                box={{
                  background: signature.hasWarning ? 'yellow200' : 'white',
                  textAlign: value === signature.address ? 'right' : 'left',
                }}
              >
                {signature.hasWarning && value === signature.address ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="spaceBetween"
                  >
                    {value}
                    <Icon icon="warning" color="blue400" />
                  </Box>
                ) : (
                  value
                )}
              </T.Data>
            )
        })}
      </T.Row>
    )
  }

  return (
    <>
      <T.Table>
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
            signatures.map((signature, index) => renderRow(signature, index))}
        </T.Body>
      </T.Table>
    </>
  )
}

export default RecommendationTable
