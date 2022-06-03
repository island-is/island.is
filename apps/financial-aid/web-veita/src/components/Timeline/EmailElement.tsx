import React from 'react'

import { Text, Box, Icon } from '@island.is/island-ui/core'
import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'

import * as styles from '../History/History.css'

interface Props {
  email: string
  event: ApplicationEventType
}

const EmailElement = ({ email, event }: Props) => {
  if (
    event !== ApplicationEventType.REJECTED &&
    event !== ApplicationEventType.APPROVED
  ) {
    return null
  }

  return (
    <Box marginBottom={2} className={styles.timelineMessages}>
      <Icon icon="mail" type="outline" color="blue400" />
      <Text>{`Tölvupóstur var sendur á netfangið ${email}`}</Text>
    </Box>
  )
}

export default EmailElement
