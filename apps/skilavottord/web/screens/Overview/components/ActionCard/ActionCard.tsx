import React, { FC } from 'react'
import {
  Box,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
  Tooltip,
  Inline,
} from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

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

interface ActionCardProps {
  onContinue: () => void
  car: MockCar
}

export const ActionCard: FC<ActionCardProps> = ({
  onContinue,
  car: { id, name, model, year, recyclable, isCoOwned = false },
}: ActionCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <OutlinedBox backgroundColor="white">
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '7/10', '7/10']}>
            <GridRow>
              <GridColumn span={['6/10', '8/10', '8/10', '7/10']}>
                <Box paddingLeft={4} paddingY={4}>
                  <Stack space={1}>
                    <Typography variant="h5">{id}</Typography>
                    <Typography variant="p">
                      {`${name} ${model}, ${year}`}
                    </Typography>
                  </Stack>
                </Box>
              </GridColumn>
              <GridColumn span={['4/10', '2/10', '2/10', '3/10']}>
                {isCoOwned && (
                  <ColumnBox width="full" paddingRight={[4, 4, 4, 1]}>
                    <Typography variant="h5">{t.status.coOwned}</Typography>
                  </ColumnBox>
                )}
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '3/10', '3/10']}>
            {recyclable ? (
              <ColumnBox
                background="blue100"
                width="full"
                textAlign="center"
                borderRadius="large"
                paddingX={4}
                paddingY={4}
              >
                <Button
                  size="small"
                  width={isMobile ? 'fluid' : 'normal'}
                  onClick={onContinue}
                >
                  {t.actions.valid}
                </Button>
              </ColumnBox>
            ) : (
              <ColumnBox
                borderColor="blue200"
                borderTopWidth={isMobile ? 'standard' : 'none'}
                borderLeftWidth={isMobile ? 'none' : 'standard'}
                borderStyle="solid"
                borderRadius="large"
                padding={4}
                width="full"
                textAlign="center"
              >
                <Inline space={'smallGutter'}>
                  <Typography variant="pSmall">{t.actions.invalid}</Typography>
                  <Tooltip text={t.tooltip} colored />
                </Inline>
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
