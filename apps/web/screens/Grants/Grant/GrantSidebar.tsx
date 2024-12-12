import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  BoxProps,
  Button,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { InstitutionPanel } from '@island.is/web/components'
import { Grant } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'
import { generateStatusTag, parseStatus } from '../utils'

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

const generateSidebarPanel = (
  data: Array<React.ReactElement>,
  background: BoxProps['background'],
) => {
  if (!data.length) {
    return undefined
  }
  return (
    <Box background={background} padding={3} borderRadius="standard">
      <Stack space={2}>{data}</Stack>
    </Box>
  )
}

export const GrantSidebar = ({ grant, locale }: Props) => {
  const { linkResolver } = useLinkResolver()
  const { formatMessage } = useIntl()

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
          status.deadlineStatus ? (
            <Text variant="medium">{status.deadlineStatus}</Text>
          ) : undefined,
        ),
        generateLine(
          formatMessage(m.single.status),
          grant?.status ? (
            <Text variant="medium">
              {
                generateStatusTag(status.applicationStatus, formatMessage)
                  ?.label
              }
            </Text>
          ) : undefined,
        ),
      ].filter(isDefined) ?? [],
    [grant, formatMessage, linkResolver, status],
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
              newTab
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

  const supportLinksPanelData = useMemo(
    () =>
      grant.supportLinks
        ?.map((link) => {
          if (!link.url || !link.text || !link.id) {
            return null
          }
          return (
            <LinkV2
              newTab
              key={link.id}
              href={link.url}
              underlineVisibility="hover"
            >
              <Button
                size="medium"
                icon="link"
                iconType="outline"
                variant="text"
              >
                {link.text}
              </Button>
            </LinkV2>
          )
        })
        .filter(isDefined) ?? [],
    [grant.supportLinks],
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
      {generateSidebarPanel(detailPanelData, 'blue100')}
      {generateSidebarPanel(filesPanelData, 'red100')}
      {generateSidebarPanel(supportLinksPanelData, 'purple100')}
    </Stack>
  )
}
