import React, { ReactNode } from 'react'
import { useMeasure } from 'react-use'
import {
  Box,
  Stack,
  Text,
  FocusableBox,
  Hyphen,
} from '@island.is/island-ui/core'
// import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './DataLinkCard.css'

export interface DataLinkCardProps {
  title: string
  body: string
  link?: string
}

export const DataLinkCard = ({ title, body, link }: DataLinkCardProps) => {
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

  if (link) {
    return (
      <FocusableBox
        href={link}
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
