import React, { FC } from 'react'
import { Application } from '@island.is/application/core'
import { Endorsement } from '../../types'
import { Box, Table as T, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface EndorsementTableProps {
  application: Application
  endorsements?: Endorsement[]
}

const EndorsementTable: FC<EndorsementTableProps> = ({ endorsements }) => {
  const { formatMessage } = useLocale()
  const renderRow = (endorsements: Endorsement, index: number) => {
    const cell = Object.entries(endorsements)
    return (
      <T.Row key={index}>
        {cell.map(([_key, value], i) => {
          if (typeof value === 'string') {
            return (
              <T.Data
                key={i}
                box={{
                  background: endorsements.hasWarning ? 'yellow200' : 'white',
                  textAlign: value === endorsements.address ? 'right' : 'left',
                }}
              >
                {endorsements.hasWarning && value === endorsements.address ? (
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
                          m.validationMessages.signatureInvalid,
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
          <T.HeadData>{formatMessage(m.endorsementTable.thDate)}</T.HeadData>
          <T.HeadData>{formatMessage(m.endorsementTable.thName)}</T.HeadData>
          <T.HeadData>
            {formatMessage(m.endorsementTable.thNationalNumber)}
          </T.HeadData>
          <T.HeadData box={{ textAlign: 'right' }}>
            {formatMessage(m.endorsementTable.thAddress)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {endorsements &&
          endorsements.length &&
          endorsements.map((endorsements, index) =>
            renderRow(endorsements, index),
          )}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
