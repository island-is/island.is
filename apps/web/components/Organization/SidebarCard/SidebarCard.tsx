import React from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SidebarCard as Card } from '@island.is/web/graphql/schema'

import * as styles from './SidebarCard.css'

interface SidebarCardProps {
  sidebarCard: Card
}

export const SidebarCard: React.FC<
  React.PropsWithChildren<SidebarCardProps>
> = ({ sidebarCard }) => (
  <Box marginTop={4} border="standard" borderRadius="large" padding={4}>
    <GridContainer>
      <GridRow>
        <GridColumn span={['3/12', '3/12', '12/12']}>
          <Box
            display="flex"
            justifyContent={'center'}
            alignItems={'center'}
            paddingBottom={2}
          >
            <Icon icon="warning" color="red400" className={styles.iconStyle} />
          </Box>
        </GridColumn>
        <GridColumn
          offset={['1/12', '1/12', '0']}
          span={['8/12', '8/12', '12/12']}
        >
          <Text variant="small">{sidebarCard.contentString}</Text>
          <Box display="flex" justifyContent="flexEnd" paddingTop={2}>
            <Link href={sidebarCard.link?.url ?? ''}>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
                size="small"
              >
                {sidebarCard?.link?.text}
              </Button>
            </Link>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
