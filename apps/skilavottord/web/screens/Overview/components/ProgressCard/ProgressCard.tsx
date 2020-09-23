import React, { FC } from 'react'
import {
  Box,
  Stack,
  Typography,
  Tag,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import ProgressBar from '../ProgressBar/ProgressBar'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { isMobile } from '@island.is/skilavottord-web/utils/isMobile'
import { useI18n } from '@island.is/skilavottord-web/i18n'

interface MockCar {
  id: string
  name: string
  model: string
  year: number
  color: number
  recyclable: boolean
  status?: string
  isCoOwned?: boolean
}

interface ProgressCardProps {
  onClick?: () => void
  car: MockCar
}

export const ProgressCard: FC<ProgressCardProps> = ({
  onClick,
  car: { id, name, model, year, status = 'pending' },
}: ProgressCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()
  return (
    <OutlinedBox
      paddingY={4}
      paddingX={4}
      borderColor={status === 'pending' ? 'blue200' : 'dark200'}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
            <Stack space={2}>
              <Stack space={1}>
                <Typography variant="h5">{id}</Typography>
                <Typography variant="p">{`${name} ${model}, ${year}`}</Typography>
              </Stack>
              <Box paddingRight={[0, 0, 0, 4]}>
                <ProgressBar progress={status === 'pending' ? 50 : 100} />
              </Box>
            </Stack>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '10/10', '3/10']}>
            <Box marginTop={[3, 3, 3, 0]}>
              <Stack space={2}>
                <Box
                  display="flex"
                  justifyContent={isMobile() ? 'flexStart' : 'flexEnd'}
                >
                  <Tag
                    variant={status === 'pending' ? 'red' : 'darkerMint'}
                    label
                  >
                    {status === 'pending'
                      ? 'Take to recycling company'
                      : 'Recycled'}
                  </Tag>
                </Box>
                <Box
                  display="flex"
                  justifyContent={isMobile() ? 'flexStart' : 'flexEnd'}
                  paddingTop={[0, 0, 0, 3]}
                >
                  <Button
                    variant="text"
                    icon="arrowRight"
                    size="small"
                    onClick={onClick}
                  >
                    {status === 'pending'
                      ? t.buttons.openProcess
                      : t.buttons.seeDetails}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </OutlinedBox>
  )
}
