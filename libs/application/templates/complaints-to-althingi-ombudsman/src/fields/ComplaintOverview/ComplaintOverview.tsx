import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { ComplaintsToAlthingiOmbudsman } from '../../lib/dataSchema'
import { ComplainedForTypes } from '../../shared'

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = (application as any).answers as ComplaintsToAlthingiOmbudsman
  const { name, ssn, phone, email, address } = answers.information

  return (
    <Box component="section">
      <ReviewGroup>
        <GridRow>
          <GridColumn span={'4/12'}>
            <Text variant="h5">
              {formatMessage('Upplýsingar frá þjóðskrá')}
            </Text>
            <Text>{formatMessage(`${name}, ${ssn}, ${phone}, ${email}`)}</Text>
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Text variant="h5">{formatMessage('Heimilisfang')}</Text>
            <Text>{formatMessage(address)}</Text>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup>
        <GridRow>
          <GridColumn span={'4/12'}>
            <Text variant="h5">{formatMessage('Nafn')}</Text>
            <Text>{formatMessage(name)}</Text>
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Text variant="h5">{formatMessage('Heimilisfang')}</Text>
            <Text>{formatMessage('address')}</Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'4/12'}>
            <Text variant="h5">{formatMessage('Sími')}</Text>
            <Text>{formatMessage(phone)}</Text>
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Text variant="h5">{formatMessage('Netfang')}</Text>
            <Text>{formatMessage(email)}</Text>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup>
        <ValueLine
          label="Kvartað fyrir"
          value={answers.complainedFor?.decision}
        />
        {answers.complainedFor?.decision === ComplainedForTypes.SOMEONEELSE && (
          <ValueLine
            label="Tengsl við þann aðila"
            value={answers.complainedForInformation?.connection}
          />
        )}
      </ReviewGroup>

      <ReviewGroup>
        <GridRow>
          <GridColumn span={'4/12'}>
            <ValueLine
              label="Kvörtun beinist að"
              value={answers.complaintDescription.complaineeName}
            />
          </GridColumn>
          <GridColumn span={'6/12'}>
            <ValueLine
              label={formatMessage('Nafn stjórnvalds')}
              value="TODO?"
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup>
        <ValueLine label="Lagt fyrir dómstóla" value="TODO?" />
      </ReviewGroup>
      <ReviewGroup>
        <Text variant="h5">Fylgiskjöl</Text>
      </ReviewGroup>
      {/* 
        6. Staðfesting og rafræn undirritun
      */}
    </Box>
  )
}

export const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
    </>
  )
}
