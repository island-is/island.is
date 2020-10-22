import React, { FC } from 'react'
import { GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const SubmitFormStep: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:submitting',
              defaultMessage: 'Vista gögn',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:submit-form-message',
              defaultMessage: `
                Vista niður þínar upplýsingar í kerfi island.is
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
    </>
  )
}
