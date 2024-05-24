// CaseInfoSection.tsx
import React, { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './InfoSection.css'

interface DataSection {
  title: string
  value?: React.ReactNode
}

interface CaseInfoSectionProps {
  data: DataSection[]
}

const CaseInfoSection: FC<CaseInfoSectionProps> = ({ data }) => {
  return (
    <Box className={styles.infoCardDataContainer}>
      {data.map((dataItem, index) => {
        return (
          <Box
            data-testid={`infoCardDataContainer${index}`}
            key={dataItem.title}
            marginBottom={1}
          >
            <Text variant="h4" marginBottom={1}>
              {dataItem.title}
            </Text>
            {typeof dataItem.value === 'string' ? (
              <Text>{dataItem.value}</Text>
            ) : (
              dataItem.value
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default CaseInfoSection
