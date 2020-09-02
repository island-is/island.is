import React, { FC } from 'react'
import * as styles from './CarAction.treat'
import {
  Box,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Tag,
} from '@island.is/island-ui/core'

export interface LinkCardProps {
  onClick?: () => void
  title: string
  description: string
  href?: string
  status?: string
}

export const CarAction: FC<LinkCardProps> = (
  { href, onClick, title, description, status }: LinkCardProps,
  ref,
) => {
  return (
    <Box className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span="6/12">
            <Box padding={[2, 2, 3]}>
              <GridRow>
                <Typography variant="h4" color="blue400">
                  {title}
                </Typography>
              </GridRow>
              <GridRow>{description}</GridRow>
            </Box>
          </GridColumn>
          <GridColumn span="3/12">
            <Box padding={[1, 1, 2]}>
              <Tag variant='darkerMint' label>{status}</Tag>
            </Box>
          </GridColumn>
          {href && (
            <GridColumn span="3/12" className={styles.linkContainer}>
              <Box padding={[2, 2, 3]}>
                <Button size="small" onClick={onClick}>
                  Recycle car
                </Button>
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </GridContainer>
    </Box>
  )
}
