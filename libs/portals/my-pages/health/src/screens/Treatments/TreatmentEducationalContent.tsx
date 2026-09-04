import { Box, Input, Stack, Tag, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { useGetHealthTreatmentDocumentsQuery } from './TreatmentEducationalContent.generated'

type UseParams = {
  id: string
}

const TreatmentEducationalContent = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loading, error } = useGetHealthTreatmentDocumentsQuery({
    variables: { treatmentId: id },
  })

  // One card per link; the parent document supplies the sent date and a
  // title fallback for links with an empty label.
  const cards = data?.healthDirectorateTreatmentDocuments
    ?.flatMap((document) =>
      document.links.map((link, index) => ({
        key: `${document.id}-${index}`,
        title:
          link.label?.trim() ||
          document.title?.trim() ||
          formatMessage(m.healthTreatmentEducationalContent),
        sentAt: document.sentAt,
        href: link.href,
      })),
    )
    .filter(
      (card) =>
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <IntroWrapper
      title={formatMessage(m.healthTreatmentEducationalContent)}
      intro={messages.educationalContentIntro}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirTreatmentTooltip),
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : (
        <Stack space={3}>
          <Box width="half">
            <Input
              name="treatment-documents-search"
              aria-label={formatMessage(m.searchPlaceholder)}
              placeholder={formatMessage(m.searchPlaceholder)}
              icon={{ name: 'search' }}
              size="xs"
              backgroundColor="blue"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Box>

          {!cards?.length ? (
            <Problem type="no_data" noBorder={false} />
          ) : (
            <Stack space={2}>
              {cards.map((card) => (
                <Box
                  key={card.key}
                  background="white"
                  border="standard"
                  borderColor="blue200"
                  borderRadius="large"
                  padding={3}
                >
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="flexEnd"
                    columnGap={2}
                  >
                    <Box>
                      <Text variant="h4" as="h2" marginBottom={3}>
                        {card.title}
                      </Text>
                      <Tag variant="purple" outlined disabled>
                        {formatMessage(messages.sent, {
                          date: formatDate(card.sentAt),
                        })}
                      </Tag>
                    </Box>
                    <LinkButton
                      to={card.href}
                      text={formatMessage(messages.openDocument)}
                      variant="text"
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default TreatmentEducationalContent
