import { useState } from 'react'
import { Box, FilterInput, Icon, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  IntroWrapper,
  LinkResolver,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetActivePregnancyQuery } from './Pregnancy.generated'
import { useGetPregnancyCommunicationsQuery } from './PregnancyCommunications.generated'

const PregnancyCommunications = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')

  const {
    data: pregnancyData,
    loading: pregnancyLoading,
    error: pregnancyError,
  } = useGetActivePregnancyQuery()

  const pregnancyId = pregnancyData?.healthDirectorateActivePregnancy?.id

  const {
    data,
    loading: communicationsLoading,
    error: communicationsError,
  } = useGetPregnancyCommunicationsQuery({
    variables: { pregnancyId: pregnancyId ?? '' },
    skip: !pregnancyId,
  })

  const loading = pregnancyLoading || (!!pregnancyId && communicationsLoading)
  const error = pregnancyError ?? communicationsError

  const communications = (
    data?.healthDirectoratePregnancyCommunications ?? []
  ).filter((item) => {
    if (!search) return true
    const term = search.toLowerCase()
    return (
      item.text?.toLowerCase().includes(term) ||
      item.subjectTerm?.toLowerCase().includes(term) ||
      item.authorName?.toLowerCase().includes(term)
    )
  })

  return (
    <IntroWrapper
      title={formatMessage(messages.pregnancyCommunicationsTitle)}
      intro={formatMessage(messages.pregnancyCommunicationsIntro)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaPregnancyTooltip),
      }}
    >
      <Box width="half" marginBottom={4}>
        <FilterInput
          name="pregnancy-communications-search"
          placeholder={formatMessage(
            messages.pregnancyCommunicationsSearchPlaceholder,
          )}
          value={search}
          onChange={setSearch}
          backgroundColor="blue"
        />
      </Box>

      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : communications.length === 0 ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <Box border="standard" borderColor="blue200" borderRadius="large">
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            background="blue100"
            paddingX={3}
            paddingY={2}
          >
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(messages.pregnancyCommunicationsColumnHeader)}
            </Text>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(messages.date)}
            </Text>
          </Box>
          {communications.map((item) => {
            const kindLabel = formatMessage(
              item.kind === 'PHONE_CALL'
                ? messages.pregnancyCommunicationPhoneCall
                : messages.pregnancyCommunicationExamination,
            )
            const subject = item.subjectTerm ?? item.text
            return (
              <LinkResolver
                key={item.id}
                href={HealthPaths.HealthPregnancyCommunicationDetail.replace(
                  ':id',
                  item.id,
                )}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                  paddingX={3}
                  paddingY={2}
                  borderTopWidth="standard"
                  borderColor="blue200"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="blue100"
                    borderRadius="full"
                    padding={2}
                    flexShrink={0}
                  >
                    <Icon
                      icon={item.kind === 'PHONE_CALL' ? 'call' : 'reader'}
                      type="outline"
                      color="blue400"
                    />
                  </Box>
                  <Box minWidth={0} flexGrow={1}>
                    {item.authorName && (
                      <Text variant="medium">{item.authorName}</Text>
                    )}
                    <Text variant="medium" color="blue400" truncate>
                      {kindLabel}
                      {subject ? `: ${subject}` : ''}
                    </Text>
                  </Box>
                  {item.dateTime && (
                    <Box flexShrink={0}>
                      <Text variant="medium">{formatDate(item.dateTime)}</Text>
                    </Box>
                  )}
                </Box>
              </LinkResolver>
            )
          })}
        </Box>
      )}
    </IntroWrapper>
  )
}

export default PregnancyCommunications
