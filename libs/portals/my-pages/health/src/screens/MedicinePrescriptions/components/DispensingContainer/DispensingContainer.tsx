import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
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
    <Box
      marginY={[1, 1, 1, 2, 2]}
      marginX={[0, 0, 0, 2, 2]}
      className={styles.container}
    >
      <Text fontWeight="medium" paddingBottom={[1, 1, 1, 2, 2]}>
        {label}
      </Text>
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} span={['12/12', '12/12', '6/12']}>
              <GridContainer className={styles.innerGrid}>
                <GridRow>
                  <GridColumn>
                    <Box paddingLeft={1} display="flex" alignItems="flexStart">
                      <Hidden below="md">
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
                      </Hidden>
                      <Box className={styles.text}>
                        <Text fontWeight="medium">{item.title}</Text>
                        <Text fontWeight="regular" color="dark400">
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
