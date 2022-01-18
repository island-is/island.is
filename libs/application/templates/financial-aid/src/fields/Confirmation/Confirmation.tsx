import React from 'react'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { confirmation } from '../../lib/messages'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import DescriptionText from '../DescriptionText/DescriptionText'

const Confirmation = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginTop={[4, 4, 5]}>
        <AlertMessage
          type="success"
          title="Umsókn þín um fjárhagsaðstoð er móttekin"
        />
      </Box>

      <Text as="h3" variant="h3" marginTop={[4, 4, 5]}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>

      <Box marginTop={2}>
        <DescriptionText text={confirmation.nextSteps.content} />
      </Box>
    </>
  )
}

export default Confirmation
