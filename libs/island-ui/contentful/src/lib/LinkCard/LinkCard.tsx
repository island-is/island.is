import React, { FC } from 'react'
import { Box, Button, Text, Link, type TextProps } from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

export interface LinkCardProps {
  title: string
  body?: string
  linkUrl: string
  linkText?: string
}

export const LinkCard: FC<React.PropsWithChildren<LinkCardProps>> = ({
  title,
  body,
  linkUrl,
  linkText,
}) => {
  const newTab = shouldLinkOpenInNewWindow(linkUrl);
  const color: TextProps['color'] = 'currentColor';

  return (
    <Box
      width="full"
      background="white"
      display="flex"
      justifyContent="spaceBetween"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      paddingY={4}
      paddingX={[3, 3, 3, 3, 4]}
      alignItems={['flexStart', 'center']}
      flexDirection={['column', 'row']}
    >
      <Box marginRight={[0, 2]} marginBottom={[3, 0]}>
        <Text variant="h3" color={color}>
          {title}
        </Text>
        {body && (
          <Text color={color} paddingTop={1}>
            {body}
          </Text>
        )}
      </Box>
      <Link href={linkUrl} newTab={newTab} skipTab>
        <Button icon={newTab ? 'open' : 'arrowForward'} iconType="outline" nowrap>
          {linkText}
        </Button>
      </Link>
    </Box>
  )
}

export default LinkCard
