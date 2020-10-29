import React, { FC } from 'react'
import {
  Box,
  Stack,
  Columns,
  Column,
  Button,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './ActionCard.treat'
import { format } from 'date-fns'

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
            <Text variant="eyebrow" color="purple400">
              {label}
            </Text>
            <Text variant="h3">{title}</Text>
          </Stack>
        </Column>
        <Column width="content">
          <Stack space={1}>
            <Box justifyContent="flexEnd" display="flex">
              <Text variant="small" as="span" color="dark400">
                {format(date, 'dd.MM.yyyy')}
              </Text>
            </Box>
            <Button
              icon="arrowForward"
              colorScheme="default"
              iconType="filled"
              onBlur={function noRefCheck() {}}
              onClick={cta.onClick}
              onFocus={function noRefCheck() {}}
              size="small"
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
