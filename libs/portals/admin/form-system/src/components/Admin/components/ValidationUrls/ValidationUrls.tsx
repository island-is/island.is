import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'

export const ValidationUrls = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Text>{formatMessage(m.prodUrl)}</Text>
    </>
  )
}
