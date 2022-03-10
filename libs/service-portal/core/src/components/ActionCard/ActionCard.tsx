import React, { FC } from 'react'
import {
  Box,
  Button,
  Text,
  Link,
  LoadingDots,
  FocusableBox,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'

import * as styles from './ActionCard.css'

interface Props {
  label: string
  title: string
  date: Date
  loading?: boolean
  cta: {
    externalUrl?: string
    label: string
    onClick: () => void
  }
}

export const ActionCard: FC<Props> = ({ label, title, date, cta, loading }) => {
  return (
    <Box
      className={styles.wrapper}
      paddingTop={[2, 3]}
      paddingBottom={[2, 3]}
      paddingX={[2, 3]}
      border="standard"
      borderRadius="large"
      position="relative"
    >
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <Text variant="eyebrow" color="purple400">
          {label}
        </Text>
        <Text variant="small" as="span" color="dark400">
          {format(date, dateFormat.is)}
        </Text>
      </Box>
      <Box
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <FocusableBox component="button" onClick={cta.onClick}>
          <Text variant="h4" as="h4" color="blue400">
            {title}
          </Text>
        </FocusableBox>
        <Box className={styles.buttonWrapper} marginLeft={[0, 3]}>
          {cta.externalUrl ? (
            <Link href={cta.externalUrl}>
              <Button
                icon="open"
                colorScheme="default"
                iconType="outline"
                size="small"
                type="button"
                variant="text"
              >
                {cta.label}
              </Button>
            </Link>
          ) : (
            <Button
              icon="open"
              colorScheme="default"
              iconType="outline"
              onClick={cta.onClick}
              size="small"
              type="button"
              variant="text"
            >
              {cta.label}
            </Button>
          )}
        </Box>
      </Box>
      {loading && (
        <Box
          className={styles.isLoadingContainer}
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="large"
          background="blue100"
        >
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}

export default ActionCard
