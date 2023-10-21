import React, { FC } from 'react'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { PropertyTableRow } from '../PropertyTableRow'

interface PropertyTableProps {
  myProperties: [PropertyDetail] | undefined
  selectHandler: (property: PropertyDetail | undefined) => void
  selectedPropertyNumber: string | undefined
}

export const PropertyTable: FC<
  React.PropsWithChildren<FieldBaseProps & PropertyTableProps & PropertyDetail>
> = ({
  application,
  field,
  myProperties,
  selectHandler,
  selectedPropertyNumber,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingY={2}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyNumber)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyMarking)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyDescription)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyAddress)} />
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {myProperties &&
              myProperties.map((p: PropertyDetail) => (
                <PropertyTableRow
                  application={application}
                  field={field}
                  key={p.propertyNumber}
                  selectHandler={selectHandler}
                  propertyInfo={p}
                  selectedPropertyNumber={selectedPropertyNumber}
                />
              ))}
          </T.Body>
        </T.Table>
      </Box>
    </>
  )
}

const TableHeadText: FC<React.PropsWithChildren<{ text: string }>> = ({
  text,
}) => {
  return (
    <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
      {text}
    </Text>
  )
}
