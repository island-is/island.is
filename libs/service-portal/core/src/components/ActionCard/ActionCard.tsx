import React, { FC } from 'react'
import {
  Box,
  Typography,
  Stack,
  Inline,
  Columns,
  Column,
  Button,
} from '@island.is/island-ui/core'
import * as styles from './ActionCard.treat'
import { format } from 'date-fns/esm'

interface Props {
  label: string
  title: string
  date: Date
  cta: {
    label: string
    onClick: () => void
  }
}

export const ActionCard: FC<Props> = ({ label, title, date, cta }) => {
  return (
    <Box
      className={styles.wrapper}
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
    >
      <Columns alignY="center" space={3}>
        <Column>
          <Stack space={1}>
            <Typography variant="eyebrow" color="purple400">
              {label}
            </Typography>
            <Typography variant="h3">{title}</Typography>
          </Stack>
        </Column>
        <Column width="content">
          <Stack space={1}>
            <Inline space={1} alignY="center">
              <Typography variant="pSmall" color="dark300">
                {format(date, 'dd.MM.yyyy')}
              </Typography>
            </Inline>
            <Button
              icon="chevronForward"
              colorScheme="default"
              iconType="filled"
              onBlur={function noRefCheck() {}}
              onClick={cta.onClick}
              onFocus={function noRefCheck() {}}
              size="default"
              type="button"
              variant="text"
            >
              {cta.label}
            </Button>
          </Stack>
        </Column>
      </Columns>
    </Box>
  )
}

export default ActionCard
