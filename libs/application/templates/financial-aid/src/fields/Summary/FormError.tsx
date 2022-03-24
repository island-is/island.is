import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'
import * as styles from '../Shared.css'
import * as m from '../../lib/messages'

interface Props {
  error: boolean
}

const FormError = ({ error }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box
      className={cn(styles.errorMessage, {
        [`${styles.showErrorMessage}`]: error,
      })}
    >
      <Text color="red600" fontWeight="semiBold" variant="small">
        {formatMessage(m.summaryForm.general.errorMessage)}
      </Text>
    </Box>
  )
}

export default FormError
