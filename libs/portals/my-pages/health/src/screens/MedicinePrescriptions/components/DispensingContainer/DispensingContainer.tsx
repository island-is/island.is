import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  IconProps,
  Text,
} from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './DispensingContainer.css'

interface Props {
  label: string
  data: {
    title: string
    value: string
    icon: {
      type: IconProps['icon']
      color: IconProps['color']
    }
  }[]
}

const DispensingContainer: React.FC<Props> = ({ label, data }) => {
  return (
    <Box margin={2}>
      <Text variant="small" fontWeight="medium" paddingBottom={2}>
        {label}
      </Text>
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} span={'6/12'}>
              <GridContainer className={styles.innerGrid}>
                <GridRow>
                  <GridColumn>
                    <Box paddingLeft={1} display="flex" alignItems="flexStart">
                      <Box
                        paddingX={1}
                        display="flex"
                        style={{ paddingTop: 2 }}
                      >
                        <Icon
                          icon={item.icon.type}
                          size="small"
                          color={item.icon.color}
                          type="outline"
                        />
                      </Box>
                      <Box>
                        <Text variant="small" fontWeight="medium">
                          {item.title}
                        </Text>
                        <Text variant="small" color="dark400">
                          {item.value}
                        </Text>
                      </Box>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default DispensingContainer
