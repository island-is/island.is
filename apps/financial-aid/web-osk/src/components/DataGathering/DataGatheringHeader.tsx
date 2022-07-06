import React from 'react'
import { Box, Icon, Text } from '@island.is/island-ui/core'
import * as styles from './DataGatheringHeader.css'

const DataGatheringHeader = () => {
  return (
    <>
      <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
        Gagnaöflun
      </Text>

      <Box className={styles.textIconContainer} marginBottom={3}>
        <Icon color="blue400" icon="fileTrayFull" size="large" type="outline" />

        <Text as="h2" variant="h4">
          Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.
        </Text>
      </Box>
    </>
  )
}

export default DataGatheringHeader
