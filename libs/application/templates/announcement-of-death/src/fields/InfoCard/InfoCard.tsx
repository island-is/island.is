import React, { FC } from 'react'
import { Application, FieldBaseProps } from '@island.is/application/core'
import { GridColumn, GridRow, ProfileCard } from '@island.is/island-ui/core'

type InfoCardProps = {
  field: {
    props: {
      cards: (
        application: Application,
      ) => {
        title?: string
        description?: string | string[]
      }[]
    }
  }
}

export const InfoCard: FC<FieldBaseProps & InfoCardProps> = ({
  application,
  field,
}) => (
  <GridRow>
    {field.props.cards(application).map(({ title, description }, idx) => (
      <GridColumn span={['12/12', '12/12', '6/12']} key={idx} paddingTop={3}>
        <ProfileCard heightFull title={title} description={description} />
      </GridColumn>
    ))}
  </GridRow>
)
