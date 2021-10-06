import React from 'react'
import { Link } from 'react-router-dom'
import format from 'date-fns/format'

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
  validTo: string
}

function AccessCard({
  title,
  group,
  description,
  href,
  tags,
  validTo,
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
          <Text variant="small">
            {validTo
              ? format(new Date(validTo), 'dd.MM.yyyy')
              : formatMessage({
                  id:
                    'service.portal.settings.accessControl:home-view-undetermined',
                  defaultMessage: 'Óákveðið',
                })}
          </Text>
        </Inline>
      </Box>
      <Box marginTop={2}>
        <Box display="flex" justifyContent="spaceBetween">
          <Inline alignY="bottom" space={1}>
            {tags.map((tag, index) => (
              <Tag disabled key={index}>
                {tag}
              </Tag>
            ))}
          </Inline>
          <Link to={href}>
            <ArrowLink>
              {formatMessage({
                id: 'service.portal.settings.accessControl:home-view-access',
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
