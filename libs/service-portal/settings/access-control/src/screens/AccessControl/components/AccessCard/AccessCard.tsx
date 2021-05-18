import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import {
  Box,
  Text,
  Stack,
  ArrowLink,
  Tag,
  Inline,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface PropTypes {
  title: string
  group: string
  description: string
  href: string
  tags: string[]
  created: string
}

function AccessCard({
  title,
  group,
  description,
  href,
  tags,
  created,
}: PropTypes) {
  const { formatMessage } = useLocale()

  return (
    <Box
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
        <Stack space="smallGutter">
          <Text variant="eyebrow" color="purple400">
            {group}
          </Text>
          <Text variant="h3" as="h3" color="dark400">
            {title}
          </Text>
          <Text fontWeight="light">{description}</Text>
        </Stack>
        <Inline space="smallGutter">
          <Icon size="small" icon="time" color="blue400" type="outline" />
          <Text variant="small">{created}</Text>
        </Inline>
      </Box>
      <Box marginTop={2}>
        <Box display="flex" justifyContent="spaceBetween">
          <Inline alignY="bottom" space={1}>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Inline>
          <Link to={href}>
            <ArrowLink>
              {formatMessage({
                id: 'service.portal:view-access',
                defaultMessage: 'Skoða aðgang',
              })}
            </ArrowLink>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default AccessCard
