import React from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { LinkProps } from 'next/link'
import {
  Box,
  Stack,
  Text,
  FocusableBox,
  Hyphen,
} from '@island.is/island-ui/core'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './DataLinkCard.treat'

export type DataLinkCardTagsProps = {
  href?: string
  title: string
  subTitle?: string
}


export interface DataLinkCardProps {
  title: string
  description: string
  tags?: Array<DataLinkCardTagsProps>
  linkProps?: LinkProps
  link?: LinkResolverResponse
}

export const DataLinkCard = ({
  title,
  description,
  link,
}: DataLinkCardProps) => {
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
        <Box style={{ width: '100%' }}>
          <Stack space={1}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box display="inlineFlex" flexGrow={1}>
                <Text as="h3" variant="h3" color="blue400">
                  <Hyphen>{title}</Hyphen>
                </Text>
              </Box>
            </Box>
            {description && <Text>{description}</Text>}
          </Stack>
        </Box>
      </Box>
  )

  if (link?.href) {
    return (
      <FocusableBox
        href={link.href}
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

const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
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
