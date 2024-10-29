import { useIntl } from 'react-intl'

import { Box, Button, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { InstitutionPanel } from '@island.is/web/components'
import { Grant } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'
import { isDefined } from '@island.is/shared/utils'

interface Props {
  grant: Grant
  locale: Locale
}

const generateLine = (heading: string, content: React.ReactNode) => {
  return (
    <Box>
      <Text variant="medium" fontWeight="medium">
        {heading}
      </Text>
      {content}
    </Box>
  )
}

export const GrantSidebar = ({ grant, locale }: Props) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  return (
    <Stack space={3}>
      <InstitutionPanel
        institutionTitle={'Þjónustuaðili'}
        institution={grant.organization.title}
        img={grant.organization.logo?.url}
        locale={locale}
      />
      <Box background="blue100" padding={3}>
        <Stack space={2}>
          {grant?.applicationUrl &&
            generateLine(
              formatMessage(m.single.fund),
              <LinkV2
                {...linkResolver(grant.applicationUrl.type as LinkType, [
                  grant.applicationUrl.slug,
                ])}
              />,
            )}
          {generateLine(
            formatMessage(m.single.category),
            <Text variant="medium">{grant.categoryTag?.title}</Text>,
          )}
          {generateLine(
            formatMessage(m.single.type),
            <Text variant="medium">{grant.typeTag?.title}</Text>,
          )}
          {generateLine(
            formatMessage(m.single.deadline),
            <Text variant="medium">{grant.applicationDeadlineText}</Text>,
          )}
          {generateLine(
            formatMessage(m.single.status),
            <Text variant="medium">{grant.statusText}</Text>,
          )}
        </Stack>
      </Box>
      <Box background="red100" padding={3}>
        <Stack space={2}>
          {grant.files
            ?.map((f) => {
              if (!f.url) {
                return null
              }
              return (
                <LinkV2 href={f.url} underlineVisibility="hover">
                  <Button icon="download" iconType="outline" variant="text">
                    {f.title}
                  </Button>
                </LinkV2>
              )
            })
            .filter(isDefined)}
        </Stack>
      </Box>
    </Stack>
  )
}
