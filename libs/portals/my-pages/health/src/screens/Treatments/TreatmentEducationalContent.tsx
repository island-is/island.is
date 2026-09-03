import { Box, Inline, Input, Stack, Tag, Text } from '@island.is/island-ui/core'
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

  const documents = data?.healthDirectorateTreatmentDocuments?.filter(
    (document) =>
      !searchQuery ||
      document.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <IntroWrapper
      title={formatMessage(messages.educationalContent)}
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
              placeholder={formatMessage(m.searchPlaceholder)}
              icon={{ name: 'search' }}
              size="xs"
              backgroundColor="blue"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Box>

          {!documents?.length ? (
            <Problem type="no_data" noBorder={false} />
          ) : (
            <Stack space={2}>
              {documents.map((document) => (
                <Box
                  key={document.id}
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
                        {document.title ??
                          formatMessage(messages.educationalContent)}
                      </Text>
                      <Tag variant="purple" outlined disabled>
                        {`${formatMessage(messages.sent)}: ${formatDate(
                          document.sentAt,
                        )}`}
                      </Tag>
                    </Box>
                    <Inline space={2}>
                      {document.links.map((link) => (
                        <LinkButton
                          key={link.href}
                          to={link.href}
                          text={formatMessage(messages.openDocument)}
                          variant="text"
                        />
                      ))}
                    </Inline>
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
