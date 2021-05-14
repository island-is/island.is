import React, { FC, useState } from 'react'
import { Application } from '@island.is/application/core'
import { Box, Table as T, Tooltip, Checkbox } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export interface Signature {
  date: string
  name: string
  nationalRegistry: string
  address: string
  hasWarning?: boolean
  selectedForSubmission?: boolean
}

interface EndorsementTableProps {
  application: Application
  signatures?: Signature[]
}

const EndorsementTable: FC<EndorsementTableProps> = ({ signatures }) => {
  const { formatMessage } = useLocale()
  const renderRow = (signature: Signature, index: number) => {
    const cell = Object.entries(signature)
    const [selectEndorsement, setSelectEndorsement] = useState(
      signature.selectedForSubmission,
    )
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
                        color="yellow600"
                        iconSize="medium"
                        text={formatMessage(m.endorsementList.signatureInvalid)}
                      />
                    </Box>
                  </Box>
                ) : (
                  value
                )}
              </T.Data>
            )
          } else {
            return (
              <T.Data
                key={i}
                box={{
                  background: signature.hasWarning ? 'yellow200' : 'white',
                }}
              >
                <Checkbox
                  checked={signature.selectedForSubmission}
                  onChange={() => {
                    setSelectEndorsement(!selectEndorsement)
                    signature.selectedForSubmission = !signature.selectedForSubmission
                  }}
                />
              </T.Data>
            )
          }
        })}
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
        {signatures &&
          signatures.length &&
          signatures.map((signature, index) => renderRow(signature, index))}
      </T.Body>
    </T.Table>
  )
}

export default EndorsementTable
