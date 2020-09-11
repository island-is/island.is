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
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'

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
    <OutlinedBox backgroundColor="white">
      <GridContainer>
        <GridRow>
          <GridColumn span={hasCoOwner ? ["7/10", "8/10", "5/10", "5/10"] : ["7/10", "7/10", "7/10", "7/10"]}>
            <Box padding={4}>
              <Stack space={1}>
                <Typography variant="h5" color="blue400">
                  {id}
                </Typography>
                <Typography variant="p">
                  {`${brand} ${model}, ${year}`}
                </Typography>
              </Stack>
            </Box>
          </GridColumn>
          {hasCoOwner && (
            <GridColumn span={["3/10", "2/10", "2/10", "2/10"]}>
              <ColumnBox width="full">
                <Typography variant="h5">Co-owned</Typography>
              </ColumnBox>
            </GridColumn>
          )}
          <GridColumn span={["10/10", "10/10", "3/10", "3/10"]}>
            {status === 'enabled' ? (
              <ColumnBox
                className={`${styles.rightContainer} ${styles.buttonContainer}`}
                width="full"
                textAlign="center"
              >
                <Button size="small" onClick={onClick}>
                  Recycle car
                </Button>
              </ColumnBox>
            ) : (
              <ColumnBox
                className={`${styles.rightContainer} ${styles.textContainer}`}
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
    </OutlinedBox>
  )
}

const ColumnBox = (props) => {
  const { children } = props
  return (
    <Box
      {...props}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="full"
    >
      {children}
    </Box>
  )
}
