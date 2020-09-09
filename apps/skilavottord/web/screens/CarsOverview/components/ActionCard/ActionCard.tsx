import React, { FC } from 'react'
import * as styles from './ActionCard.treat'
import {
  Box,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
} from '@island.is/island-ui/core'

//TODO: Move to graphql schema (see air-discount-scheme)
type Car = {
  id: string
  brand: string
  model: string
  year: number
  status: string
  hasCoOwner?: boolean
}

interface ActionCardProps {
  onClick?: () => void
  car: Car
}

export const ActionCard: FC<ActionCardProps> = ({
  onClick,
  car: { id, brand, model, year, status, hasCoOwner = false },
}: ActionCardProps) => {
  return (
    <Box className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={hasCoOwner ? '7/12' : '9/12'}>
            <Box padding={4}>
              <Box>
                <Stack space={1}>
                  <Typography variant="h5" color="blue400">
                    {id}
                  </Typography>
                  <Typography variant="p">
                    {`${brand} ${model}, ${year}`}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </GridColumn>
          {hasCoOwner && (
            <GridColumn span="2/12">
              <ColumnBox width="full">
                <Typography variant="h5">Co-owned</Typography>
              </ColumnBox>
            </GridColumn>
          )}
          <GridColumn span="3/12">
            {status === 'enabled' ? (
              <ColumnBox
                className={`${styles.rightContainer} ${styles.enabled}`}
                width="full"
                textAlign="center"
              >
                <Button size="small" onClick={onClick}>
                  Recycle car
                </Button>
              </ColumnBox>
            ) : (
              <ColumnBox
                className={`${styles.rightContainer} ${styles.disabled}`}
                padding={4}
                width="full"
                textAlign="center"
              >
                <Typography variant="pSmall">
                  Cannot be recycled as car still has loans
                </Typography>
              </ColumnBox>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

const ColumnBox = (props) => {
  const { children } = props
  return (
    <Box
      {...props}
      display="inlineFlex"
      alignItems="center"
      justifyContent="center"
      height="full"
    >
      {children}
    </Box>
  )
}
