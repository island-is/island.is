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
import { Car } from '@island.is/skilavottord-web/types'

interface ActionCardProps {
  onContinue: () => void
  car: Car
}

export const ActionCard: FC<ActionCardProps> = ({
  onContinue,
  car: { permno, type, firstRegDate, isRecyclable, hasCoOwner },
}: ActionCardProps) => {
  const {
    t: { myCars: t },
  } = useI18n()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const toolTipText = (
    <>
      <Text variant="small">
        {t.tooltip.text} <a href={t.tooltip.link}>{t.tooltip.link}</a>
      </Text>
    </>
  )

  return (
    <OutlinedBox backgroundColor="white">
      <GridContainer>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '6/10', '7/10']}>
            <GridRow>
              <GridColumn span={['6/10', '8/10', '8/10', '7/10']}>
                <Box paddingLeft={4} paddingY={4}>
                  <Stack space={1}>
                    <Text variant="h3">{permno}</Text>
                    <Text>{`${type}, ${firstRegDate}`}</Text>
                  </Stack>
                </Box>
              </GridColumn>
              <GridColumn span={['4/10', '2/10', '2/10', '3/10']}>
                {hasCoOwner && (
                  <ColumnBox width="full" paddingRight={[4, 4, 4, 1]}>
                    <Text variant="h5">{t.status.coOwned}</Text>
                  </ColumnBox>
                )}
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={['10/10', '10/10', '4/10', '3/10']}>
            {isRecyclable ? (
              <ColumnBox
                background="blue100"
                width="full"
                textAlign="center"
                borderRadius="large"
                paddingX={4}
                paddingY={4}
              >
                <Button onClick={onContinue} fluid={isMobile}>
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
                <Text variant="small">
                  {t.actions.invalid}{' '}
                  <Tooltip text={toolTipText.props.children} />
                </Text>
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
