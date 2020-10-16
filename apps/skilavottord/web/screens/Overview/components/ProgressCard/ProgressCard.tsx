import React, { FC } from 'react'
import {
  Box,
  Stack,
  Text,
  Tag,
  ButtonDeprecated as Button,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import ProgressBar from '../ProgressBar/ProgressBar'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { MockCar } from '@island.is/skilavottord-web/types'

interface ProgressCardProps {
  onClick?: () => void
  car: MockCar
}

export const ProgressCard: FC<ProgressCardProps> = ({
  onClick,
  car: { permno, type, newregdate, status },
}: ProgressCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const justifyContent = isMobile ? 'flexStart' : 'flexEnd'

  return (
    <OutlinedBox paddingY={4} paddingX={4}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
            <Stack space={2}>
              <Stack space={1}>
                <Text variant="h3">{permno}</Text>
                <Text>{`${type}, ${newregdate}`}</Text>
              </Stack>
              <Box paddingRight={[0, 0, 0, 4]}>
                <ProgressBar
                  progress={status === 'pendingRecycle' ? 50 : 100}
                />
              </Box>
            </Stack>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '10/10', '3/10']}>
            <Box marginTop={[3, 3, 3, 0]}>
              <Stack space={2}>
                <Box display="flex" justifyContent={justifyContent}>
                  <Box>
                    <Tag
                      variant={
                        status === 'pendingRecycle' ? 'rose' : 'darkerMint'
                      }
                      label
                    >
                      {status === 'pendingRecycle'
                        ? 'Take to recycling company'
                        : 'Recycled'}
                    </Tag>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent={justifyContent}
                  paddingTop={[0, 0, 0, 3]}
                >
                  <Button
                    variant="text"
                    icon="arrowRight"
                    size="small"
                    onClick={onClick}
                  >
                    {status === 'pendingRecycle'
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
