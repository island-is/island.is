import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { AccidentNotification } from '../../lib/dataSchema'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'

export const FormOverview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as AccidentNotification

  return (
    <Box component="section" paddingTop={2}>
      <Text>
        Á þessari síðu má sjá upplýsingar um þann slasaða og nákvæma lýsingu á
        slysi, farðu vel yfir áður en þú sendir inn tilkynninguna.
      </Text>
      <Text variant="h4" paddingTop={10} paddingBottom={3}>
        Upplýsingar um þig
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Nafn" value="Hans Klaufi" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Kennitala" value="200698-2059" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Heimili" value="Kötluhlíð" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Sveitarfélag" value="270, Mosfellsbær" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Netfang" value="hansklaufi@gmail.com" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Símanúmer" value="868-2888" />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <Text variant="h4" paddingTop={6} paddingBottom={3}>
        Lýsing á slysi
      </Text>
      <ReviewGroup isLast editAction={() => null}>
        <GridRow>
          <GridColumn span="12/12">
            <ValueLine label="Slysaflokkur" value="Íþróttaslys" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Dagsetning" value="22.02.21" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <ValueLine label="Tími" value="14:45" />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '10/12']}>
            <ValueLine
              label="Ýtarleg lýsing"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque. Sed ipsum libero, hendrerit non arcu sit amet, malesuada tempor ligula. Etiam in condimentum libero, id molestie felis. "
            />
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
