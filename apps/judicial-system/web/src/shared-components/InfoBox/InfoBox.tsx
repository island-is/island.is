import { Box, Icon, Text } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './InfoBox.treat'

interface Props {
  text: string
}

const InfoBox: React.FC<Props> = (props) => {
  return (
    <div className={styles.infoBoxContainer}>
      <Box display="flex" alignItems="center">
        <Box display="flex" alignItems="center" marginRight={2} flexShrink={0}>
          <Icon type="filled" color="blue400" icon="informationCircle" />
        </Box>
        <Text variant="small">{props.text}</Text>
      </Box>
    </div>
  )
}

export default InfoBox
