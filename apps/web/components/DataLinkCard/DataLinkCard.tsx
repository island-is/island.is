import React, { ReactNode } from 'react'
import { useMeasure } from 'react-use'

import {
  Box,
  FocusableBox,
  Hyphen,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { LinkCard } from '@island.is/web/graphql/schema'

import * as styles from './DataLinkCard.css'

export const DataLinkCard = ({ title, body, linkUrl }: LinkCard) => {
  const [ref, { width }] = useMeasure()

  const shouldStack = width < 360

  const items = (
    <Box
      ref={ref}
      display="flex"
      flexGrow={1}
      flexDirection={shouldStack ? 'columnReverse' : 'row'}
      alignItems="stretch"
      justifyContent="flexEnd"
    >
      <Box width="full">
        <Stack space={1}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="inlineFlex" flexGrow={1}>
              <Text as="h3" variant="h3" color="blue400">
                <Hyphen>{title}</Hyphen>
              </Text>
            </Box>
          </Box>
          {body && <Text>{body}</Text>}
        </Stack>
      </Box>
    </Box>
  )

  if (linkUrl) {
    return (
      <FocusableBox
        href={linkUrl}
        borderRadius="large"
        flexDirection="column"
        height="full"
        width="full"
        flexGrow={1}
        background="blue100"
        borderColor="transparent"
        borderWidth="standard"
      >
        <FrameWrapper>{items}</FrameWrapper>
      </FocusableBox>
    )
  }

  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      className={styles.card}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      background="blue100"
      borderColor="transparent"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default DataLinkCard
