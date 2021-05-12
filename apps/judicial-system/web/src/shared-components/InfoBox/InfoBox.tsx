import React from 'react'
import cn from 'classnames'
import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './InfoBox.treat'

interface Props {
  text: string
  fluid?: boolean
  onDismiss?: () => void
}

const InfoBox: React.FC<Props> = (props) => {
  return (
    <div
      className={cn(styles.infoBoxContainer, { [styles.fluid]: props.fluid })}
    >
      <Box display="flex" justifyContent="spaceBetween">
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            marginRight={2}
            flexShrink={0}
          >
            <Icon type="filled" color="blue400" icon="informationCircle" />
          </Box>
          <Text variant="small">{props.text}</Text>
        </Box>

        <button onClick={props.onDismiss}>
          <Icon icon="trash" type="outline" color="blue400" />
        </button>
      </Box>
    </div>
  )
}

export default InfoBox
