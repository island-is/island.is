import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import React from 'react'
import { SidebarCard as Card } from '@island.is/web/graphql/schema'

interface SidebarCardProps {
  sidebarCard: Card
}

export const SidebarCard: React.FC<SidebarCardProps> = ({ sidebarCard }) => (
  <Box marginTop={4} border="standard" borderRadius="large" padding={4}>
    <GridContainer>
      <GridRow>
        <GridColumn span={['3/12', '3/12', '12/12']}>
          <Box
            display="flex"
            justifyContent={'center'}
            alignItems={'center'}
            paddingBottom={3}
          >
            <img
              src={
                'https://images.ctfassets.net/8k0h54kbe6bj/2c9RXjtApgqkUWeKh0s1xP/820afa7b351e638473bff013277929ea/Vector.svg'
              }
            ></img>
          </Box>
        </GridColumn>
        <GridColumn
          offset={['1/12', '1/12', '0']}
          span={['8/12', '8/12', '12/12']}
        >
          <Text variant="small">{sidebarCard.content}</Text>
          <Box display="flex" justifyContent="flexEnd" paddingTop={2}>
            <Link href={sidebarCard.link.url}>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
                size="small"
              >
                {sidebarCard.link.text}
              </Button>
            </Link>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
