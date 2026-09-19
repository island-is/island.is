import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, FilterInput, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  IntroWrapper,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import * as conversationStyles from '../HealthConversations/HealthConversations.css'
import { useGetActivePregnancyQuery } from './Pregnancy.generated'
import { useGetPregnancyCommunicationsQuery } from './PregnancyCommunications.generated'
import { formatSubjectTerm } from './utils'

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
      desktopContentSpan="10/12"
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
        <>
          <Box
            background="blue100"
            borderColor="blue200"
            borderBottomWidth="standard"
            display="flex"
            justifyContent="spaceBetween"
            paddingX={2}
            paddingY={2}
          >
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(messages.pregnancyCommunicationsColumnHeader)}
            </Text>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage(messages.date)}
            </Text>
          </Box>
          <Stack space={0}>
            {communications.map((item) => {
              const kindLabel = formatMessage(
                item.kind === 'PHONE_CALL'
                  ? messages.pregnancyCommunicationPhoneCall
                  : messages.pregnancyCommunicationExamination,
              )
              const subject = item.subjectTerm
                ? formatSubjectTerm(item.subjectTerm)
                : item.text
              return (
                <Box
                  key={item.id}
                  className={conversationStyles.conversationRow}
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                  borderColor="blue200"
                  borderBottomWidth="standard"
                  paddingX={2}
                  paddingY="p2"
                  columnGap={2}
                >
                  <Link
                    to={HealthPaths.HealthPregnancyCommunicationDetail.replace(
                      ':id',
                      item.id,
                    )}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      minWidth: 0,
                      flexGrow: 1,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      background="blue100"
                      flexShrink={0}
                      style={{ width: 48, height: 48 }}
                    >
                      <Icon
                        icon={item.kind === 'PHONE_CALL' ? 'call' : 'reader'}
                        type="outline"
                        color="blue400"
                      />
                    </Box>
                    <Box minWidth={0}>
                      {item.authorName && (
                        <Text variant="medium">{item.authorName}</Text>
                      )}
                      <Text color="blue400" truncate>
                        {kindLabel}
                        {subject ? `: ${subject}` : ''}
                      </Text>
                    </Box>
                  </Link>
                  {item.dateTime && (
                    <Box style={{ flexShrink: 0 }}>
                      <Text variant="medium">{formatDate(item.dateTime)}</Text>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>
        </>
      )}
    </IntroWrapper>
  )
}

export default PregnancyCommunications
