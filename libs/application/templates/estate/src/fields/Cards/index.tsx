import { FC } from 'react'
import { Application, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

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
  const { props } = field

  const notFilledOut = (
    <Box marginY={3}>
      <p style={{ fontStyle: 'italic' }}>{formatMessage(m.notFilledOut)}</p>
    </Box>
  )

  return (
    <GridRow>
      {props.cards(application).length ? (
        props.cards(application).map(({ title, description }, idx) => {
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
                notFilledOut
              )}
            </GridColumn>
          )
        })
      ) : (
        <GridColumn>{notFilledOut}</GridColumn>
      )}
    </GridRow>
  )
}

export default Cards
