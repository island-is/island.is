import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Grant } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import { m } from '../../messages'
import { generateStatusTag, parseStatus } from '../../utils'
import { generateLine } from './PanelLine'

interface DetailPanelProps {
  grant: Grant
  locale: Locale
  button?: boolean
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  grant,
  locale,
  button = false,
}) => {
  const { linkResolver } = useLinkResolver()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const status = useMemo(
    () => parseStatus(grant, formatMessage, locale),
    [grant, formatMessage, locale],
  )

  const detailPanelData = useMemo(
    () =>
      [
        generateLine(
          formatMessage(m.single.fund),
          grant?.fund?.link?.slug ? (
            <LinkV2
              {...linkResolver(grant.fund.link.type as LinkType, [
                grant.fund.link.slug,
              ])}
              newTab
              color="blue400"
              underline="normal"
              underlineVisibility="hover"
            >
              <Text fontWeight="semiBold" variant="medium" color="blue400">
                {grant.fund.title}
              </Text>
            </LinkV2>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.status),
          grant?.status ? (
            <>
              <Text variant="medium">
                {
                  generateStatusTag(status.applicationStatus, formatMessage)
                    ?.label
                }
              </Text>
              <Text variant="medium">{status.deadlineStatus}</Text>
            </>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.deadlinePeriod),
          status.deadlinePeriod ? (
            <Text variant="medium">{status.deadlinePeriod}</Text>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.category),
          grant?.categoryTags ? (
            <Text variant="medium">
              {grant.categoryTags
                .map((ct) => ct.title)
                .filter(isDefined)
                .join(', ')}
            </Text>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.type),
          grant?.typeTag?.title ? (
            <Text variant="medium">{grant.typeTag?.title}</Text>
          ) : undefined,
        ),
      ].filter(isDefined) ?? [],
    [grant, formatMessage, linkResolver, status],
  )
  return (
    <Box
      background={'blue100'}
      padding={3}
      borderRadius="large"
      marginBottom={3}
    >
      <Stack space={2}>{detailPanelData}</Stack>
      {button && (
        <Box marginTop={2}>
          <Button
            size="small"
            fluid
            type="button"
            onClick={() => router.push(grant.applicationUrl?.slug ?? '')}
            disabled={
              status?.applicationStatus === 'closed' ||
              status?.applicationStatus === 'unknown'
            }
          >
            {formatMessage(m.single.apply)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default DetailPanel
