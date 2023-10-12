import React, { FC } from 'react'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { GridColumn, GridRow, ProfileCard } from '@island.is/island-ui/core'
import { FormatMessage, useLocale } from '@island.is/localization'

type InfoCardProps = {
  field: {
    props: {
      cards: (application: Application) => {
        title?: string
        description?:
          | string
          | string[]
          | ((formatMessage: FormatMessage) => string | string[])
      }[]
    }
  }
}

export const InfoCard: FC<
  React.PropsWithChildren<FieldBaseProps & InfoCardProps>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      {field.props.cards(application).map(({ title, description }, idx) => (
        <GridColumn span={['12/12', '12/12', '6/12']} key={idx} paddingTop={3}>
          <ProfileCard
            heightFull
            title={title}
            description={
              typeof description === 'function'
                ? description(formatMessage)
                : description
            }
          />
        </GridColumn>
      ))}
    </GridRow>
  )
}
