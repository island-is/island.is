import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Box, Table as T, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export interface Signature {
  date: string
  name: string
  nationalRegistry: string
  address: string
  hasWarning?: boolean
}

interface RecommendationProps {
  application: Application
  signatures?: Signature[]
}

const RecommendationTable: FC<RecommendationProps> = ({ signatures }) => {
  const { formatMessage } = useLocale()
  const renderRow = (signature: Signature, index: number) => {
    const cell = Object.entries(signature)
    return (
      <T.Row key={index}>
        {cell.map(([_key, value], i) => {
          if (typeof value === 'string') {
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
                    justifyContent="flexEnd"
                  >
                    {value}
                    <Box marginLeft={2}>
                      <Tooltip
                        color="blue400"
                        iconSize="medium"
                        text={formatMessage(
                          m.gatherSignatures.signatureInvalid,
                        )}
                      />
                    </Box>
                  </Box>
                ) : (
                  value
                )}
              </T.Data>
            )
          } else {
            return null
          }
        })}
      </T.Row>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(m.gatherSignatures.thDate)}</T.HeadData>
          <T.HeadData>{formatMessage(m.gatherSignatures.thName)}</T.HeadData>
          <T.HeadData>
            {formatMessage(m.gatherSignatures.thNationalNumber)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {formatMessage(m.gatherSignatures.thAddress)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {signatures &&
          signatures.length &&
          signatures.map((signature, index) => renderRow(signature, index))}
      </T.Body>
    </T.Table>
  )
}

export default RecommendationTable
