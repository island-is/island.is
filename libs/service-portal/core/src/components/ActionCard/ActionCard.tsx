import React, { FC } from 'react'
import { Box, Stack, Button, Text } from '@island.is/island-ui/core'
import * as styles from './ActionCard.treat'
import format from 'date-fns/format'

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
      paddingTop={[2, 4]}
      paddingBottom={[2, 3]}
      paddingX={[2, 4]}
      border="standard"
      borderRadius="large"
    >
      <Stack space={1}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="eyebrow" color="purple400">
            {label}
          </Text>
          <Text variant="small" as="span" color="dark400">
            {format(date, 'dd.MM.yyyy')}
          </Text>
        </Box>
        <Box
          display={['block', 'flex']}
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <Text variant="h4">{title}</Text>
          <Box
            className={styles.buttonWrapper}
            marginTop={[1, 0]}
            marginLeft={[0, 3]}
          >
            <Button
              icon="download"
              colorScheme="default"
              iconType="outline"
              onClick={cta.onClick}
              size="small"
              type="button"
              variant="text"
            >
              {cta.label}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ActionCard
