import { Box, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  STAFRAEN_HEILSA_SLUG,
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
  treatmentId: string
}

const TreatmentEducationalContent = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { treatmentId } = useParams() as UseParams
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loading, error } = useGetHealthTreatmentDocumentsQuery({
    variables: { treatmentId },
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
        groupName: document.groupName?.trim() || undefined,
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
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaTreatmentTooltip),
      }}
      desktopContentSpan="10/12"
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
                  borderColor="blue200"
                  borderRadius="large"
                  borderWidth="standard"
                  paddingX={[3, 3, 4]}
                  paddingY={3}
                >
                  {card.groupName && (
                    <Box marginBottom={1}>
                      <Text variant="eyebrow" color="purple400">
                        {card.groupName}
                      </Text>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    flexDirection={['column', 'row']}
                    justifyContent="spaceBetween"
                    alignItems={['flexStart', 'flexEnd']}
                    columnGap={3}
                    rowGap={2}
                  >
                    <Box>
                      <Text variant="h4" as="h2">
                        {card.title}
                      </Text>
                      <Text paddingTop={1}>
                        {formatMessage(messages.sent, {
                          date: formatDate(card.sentAt),
                        })}
                      </Text>
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
