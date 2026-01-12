import React, { FC } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Stack,
  Tooltip,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { VehicleInformation } from '@island.is/skilavottord-web/graphql/schema'
import { formatYear } from '@island.is/skilavottord-web/utils'
import { dateFormat } from '@island.is/shared/constants'

interface ActionCardProps {
  onContinue: () => void
  car: VehicleInformation
}

export const ActionCard: FC<React.PropsWithChildren<ActionCardProps>> = ({
  onContinue,
  car: { permno, type, firstRegDate, isRecyclable, hasCoOwner },
}: ActionCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isTablet = width < theme.breakpoints.lg

  const toolTipText = (
    <Text variant="small">
      {t.tooltip.text} <a href={t.tooltip.link}>{t.tooltip.link}</a>
    </Text>
  )

  const modelYear = formatYear(firstRegDate, dateFormat.is)

  return (
    <OutlinedBox backgroundColor="white">
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
            <GridRow>
              <GridColumn span={['6/10', '7/10', '7/10', '7/10']}>
                <Box paddingLeft={4} paddingY={4}>
                  <Stack space={1}>
                    <Text variant="h3">{permno}</Text>
                    <Text>{`${type}, ${modelYear}`}</Text>
                  </Stack>
                </Box>
              </GridColumn>
              <GridColumn span={['4/10', '3/10', '3/10', '3/10']}>
                {hasCoOwner && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="full"
                    width="full"
                    paddingRight={[4, 4, 4, 1]}
                  >
                    <Text variant="h5">{t.status.coOwned}</Text>
                  </Box>
                )}
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '10/10', '3/10']}>
            {isRecyclable ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="full"
                background="blue100"
                width="full"
                textAlign="center"
                borderRadius="large"
                paddingX={4}
                paddingY={4}
              >
                <Button onClick={onContinue} fluid={isTablet}>
                  {t.actions.valid}
                </Button>
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="full"
                borderColor="blue200"
                borderTopWidth={isTablet ? 'standard' : undefined}
                borderLeftWidth={isTablet ? undefined : 'standard'}
                borderStyle="solid"
                borderRadius="large"
                padding={4}
                width="full"
                textAlign="center"
              >
                <Text variant="small">
                  {t.actions.invalid}{' '}
                  <Tooltip text={toolTipText.props.children} />
                </Text>
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </OutlinedBox>
  )
}
