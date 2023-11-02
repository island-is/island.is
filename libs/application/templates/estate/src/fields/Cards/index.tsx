import { FC } from 'react'
import { Application, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import NotFilledOut from '../NotFilledOut'

type Props = {
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

export const Cards: FC<React.PropsWithChildren<FieldBaseProps & Props>> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      {field.props.cards(application).length ? (
        field.props.cards(application).map(({ title, description }, idx) => {
          return (
            <GridColumn span={['12/12', '12/12', '6/12']} key={idx}>
              {title && title !== '' ? (
                <Box paddingY={'gutter'}>
                  <ProfileCard
                    heightFull
                    title={title}
                    description={
                      typeof description === 'function'
                        ? description(formatMessage)
                        : description
                    }
                  />
                </Box>
              ) : (
                <NotFilledOut />
              )}
            </GridColumn>
          )
        })
      ) : (
        <GridColumn>
          <NotFilledOut />
        </GridColumn>
      )}
    </GridRow>
  )
}

export default Cards
