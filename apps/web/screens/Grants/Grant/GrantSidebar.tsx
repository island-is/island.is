import { useMemo } from 'react'

import { Box, Button, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { InstitutionPanel } from '@island.is/web/components'
import { Grant } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'
import { useLocale } from '@island.is/localization'
import { generateStatusTag } from '../utils'

interface Props {
  grant: Grant
  locale: Locale
}

const generateLine = (heading: string, content?: React.ReactNode) => {
  if (!content) {
    return null
  }
  return (
    <Box>
      <Text variant="medium" fontWeight="semiBold">
        {heading}
      </Text>
      {content}
    </Box>
  )
}

export const GrantSidebar = ({ grant, locale }: Props) => {
  const { linkResolver } = useLinkResolver()
  const { formatMessage } = useLocale()

  const detailPanelData = useMemo(
    () =>
      [
        generateLine(
          formatMessage(m.single.fund),
          grant?.fund?.link?.slug ? (
            <Text fontWeight="semiBold" variant="medium" color="blue400">
              <LinkV2
                {...linkResolver(grant.fund.link.type as LinkType, [
                  grant.fund.link.slug,
                ])}
                newTab
                color="blue400"
                underline="normal"
                underlineVisibility="hover"
              >
                {grant.fund.title}
              </LinkV2>
            </Text>
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
        generateLine(
          formatMessage(m.single.deadline),
          grant?.applicationDeadlineStatus ? (
            <Text variant="medium">{grant.applicationDeadlineStatus}</Text>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.status),
          grant?.status ? (
            <Text variant="medium">
              {generateStatusTag(grant.status, formatMessage)?.label}
            </Text>
          ) : undefined,
        ),
      ].filter(isDefined) ?? [],
    [grant, formatMessage, linkResolver],
  )

  const filesPanelData = useMemo(
    () =>
      grant.files
        ?.map((f, index) => {
          if (!f.url) {
            return null
          }
          return (
            <LinkV2
              key={`${f.url}-${index}`}
              href={f.url}
              underlineVisibility="hover"
            >
              <Button icon="download" iconType="outline" variant="text">
                {f.title}
              </Button>
            </LinkV2>
          )
        })
        .filter(isDefined) ?? [],
    [grant.files],
  )

  return (
    <Stack space={3}>
      <InstitutionPanel
        institutionTitle={formatMessage(m.single.provider)}
        institution={
          grant.fund?.parentOrganization.title ??
          formatMessage(m.single.unknownInstitution)
        }
        img={grant.fund?.parentOrganization.logo?.url}
        locale={locale}
      />
      {detailPanelData.length ? (
        <Box background="blue100" padding={3} borderRadius="xs">
          <Stack space={2}>{detailPanelData}</Stack>
        </Box>
      ) : undefined}
      {filesPanelData.length ? (
        <Box background="red100" padding={3} borderRadius="xs">
          <Stack space={2}>{filesPanelData}</Stack>
        </Box>
      ) : undefined}
    </Stack>
  )
}
