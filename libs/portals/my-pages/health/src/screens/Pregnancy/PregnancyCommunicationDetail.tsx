import { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDateWithTime,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import ConversationBackButton from '../HealthConversations/components/ConversationBackButton'
import * as conversationStyles from '../HealthConversations/HealthConversations.css'
import { useGetActivePregnancyQuery } from './Pregnancy.generated'
import { useGetPregnancyCommunicationDetailQuery } from './PregnancyCommunicationDetail.generated'
import { formatSubjectTerm, parsePhoneCallText } from './utils'

type UseParams = {
  id: string
}

interface InfoRow {
  label: string
  value?: ReactNode
}

const InfoRows = ({ rows }: { rows: InfoRow[] }) => (
  <Stack space={0}>
    {rows.map((row) => (
      <Box paddingY="p2" key={row.label}>
        <GridRow>
          <GridColumn span={['12/12', '4/12']}>
            <Text variant="medium" fontWeight="semiBold">
              {row.label}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '8/12']}>
            {typeof row.value === 'string' ? (
              <Text variant="medium" whiteSpace="preLine">
                {row.value}
              </Text>
            ) : (
              row.value
            )}
          </GridColumn>
        </GridRow>
      </Box>
    ))}
  </Stack>
)

const PregnancyCommunicationDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams
  const navigate = useNavigate()

  const {
    data: pregnancyData,
    loading: pregnancyLoading,
    error: pregnancyError,
  } = useGetActivePregnancyQuery()

  const pregnancyId = pregnancyData?.healthDirectorateActivePregnancy?.id

  const {
    data,
    loading: detailLoading,
    error: detailError,
  } = useGetPregnancyCommunicationDetailQuery({
    variables: { pregnancyId: pregnancyId ?? '', communicationId: id },
    skip: !pregnancyId,
  })

  const loading = pregnancyLoading || (!!pregnancyId && detailLoading)
  const error = pregnancyError ?? detailError
  const detail = data?.healthDirectoratePregnancyCommunicationDetail

  const phoneCall =
    detail?.__typename === 'HealthDirectoratePhoneCallCommunicationDetail'
      ? detail
      : undefined
  const isPhoneCall = !!phoneCall

  const kindTitle = formatMessage(
    isPhoneCall
      ? messages.pregnancyCommunicationPhoneCall
      : messages.pregnancyCommunicationExamination,
  )

  const notRegistered = formatMessage(messages.notRegistered)

  const registeredBy = detail?.registeredBy
    ? [detail.registeredBy.name, detail.registeredBy.profession]
        .filter(Boolean)
        .join(', ')
    : undefined

  const subjectTerm = detail?.subjectTerm
    ? formatSubjectTerm(detail.subjectTerm)
    : undefined

  const parsedPhoneCall = phoneCall?.text
    ? parsePhoneCallText(phoneCall.text)
    : undefined

  const reason =
    parsedPhoneCall?.reason ??
    subjectTerm ??
    (phoneCall?.phoneCallReason != null
      ? `#${phoneCall.phoneCallReason}`
      : undefined)

  const metaRows: InfoRow[] = detail
    ? [
        {
          label: formatMessage(messages.pregnancyRegisteredBy),
          value: registeredBy,
        },
        {
          label: formatMessage(messages.pregnancyReason),
          value: reason,
        },
        {
          label: formatMessage(
            isPhoneCall
              ? messages.pregnancyPhoneCallDate
              : messages.pregnancyExaminationDate,
          ),
          value: detail.dateTime
            ? formatDateWithTime(detail.dateTime)
            : undefined,
        },
        {
          label: formatMessage(messages.pregnancyDivision),
          value: detail.registeredBy?.divisionName,
        },
        {
          label: formatMessage(messages.pregnancyOrganization),
          value: detail.registeredBy?.organizationName,
        },
      ].filter((row) => row.value)
    : []

  const examination =
    detail?.__typename === 'HealthDirectorateExaminationCommunicationDetail'
      ? detail
      : undefined

  const fetalHeartRates = (examination?.fetalHeartRates ?? []).filter(
    (rate) => rate.soundLower != null && rate.soundUpper != null,
  )
  const fetalPositions = (examination?.fetalHeartRates ?? []).filter(
    (rate) => rate.position != null,
  )

  const examinationRows: InfoRow[] = examination
    ? [
        {
          label: formatMessage(messages.pregnancyWeight),
          value:
            examination.weight != null
              ? `${examination.weight} kg`
              : notRegistered,
        },
        {
          label: formatMessage(messages.pregnancyBloodPressure),
          value:
            examination.bloodPressureUpper != null &&
            examination.bloodPressureLower != null
              ? `${examination.bloodPressureUpper}/${examination.bloodPressureLower} mmHg`
              : notRegistered,
        },
        {
          label: formatMessage(messages.pregnancyPulse),
          value:
            examination.pulse != null
              ? formatMessage(messages.pregnancyBeatsPerMinute, {
                  value: examination.pulse,
                })
              : notRegistered,
        },
        {
          label: formatMessage(messages.pregnancyCervixHeight),
          value:
            examination.cervixHeight != null
              ? `${examination.cervixHeight} cm`
              : notRegistered,
        },
        {
          label: formatMessage(messages.pregnancyAlbumenInUrine),
          value: examination.albumenInUrineScore ?? notRegistered,
        },
        ...(fetalHeartRates.length > 0
          ? [
              {
                label: formatMessage(messages.pregnancyFetalHeartRate),
                value: (
                  <Stack space={0}>
                    {fetalHeartRates.map((rate) => (
                      <Text variant="medium" key={rate.identifier}>
                        {formatMessage(messages.pregnancyFetus, {
                          id: rate.identifier,
                        })}
                        {': '}
                        {formatMessage(messages.pregnancyBeatsPerMinute, {
                          value: `${rate.soundLower}-${rate.soundUpper}`,
                        })}
                      </Text>
                    ))}
                  </Stack>
                ),
              },
            ]
          : []),
        ...(fetalPositions.length > 0
          ? [
              {
                label: formatMessage(messages.pregnancyFetalPosition),
                value: (
                  <Stack space={0}>
                    {fetalPositions.map((rate) => (
                      <Text variant="medium" key={rate.identifier}>
                        {formatMessage(messages.pregnancyFetus, {
                          id: rate.identifier,
                        })}
                        {': '}
                        {rate.position}
                      </Text>
                    ))}
                  </Stack>
                ),
              },
            ]
          : []),
      ]
    : []

  const phoneCallRows: InfoRow[] = parsedPhoneCall?.rows ?? []

  const middleRows = examination ? examinationRows : phoneCallRows

  const titleSuffix = phoneCall
    ? parsedPhoneCall?.reason ?? subjectTerm
    : subjectTerm

  return (
    <GridContainer>
      <GridRow marginTop={[1, 0, 0]}>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box
            className={conversationStyles.messageCard}
            background="white"
            paddingTop={[2, 2, 3]}
            paddingBottom={[10, 5, 5]}
            paddingX={[2, 5, 5]}
          >
            {error && !loading ? (
              <Problem error={error} noBorder={false} />
            ) : loading ? (
              <CardLoader />
            ) : !detail ? (
              <Problem type="not_found" noBorder={false} />
            ) : (
              <>
                <Box className={conversationStyles.backButton} marginBottom={1}>
                  <ConversationBackButton
                    onClick={() =>
                      navigate(HealthPaths.HealthPregnancyCommunications)
                    }
                  />
                </Box>

                <Text variant="h4" as="h1" marginBottom={2}>
                  {titleSuffix ? `${kindTitle}: ${titleSuffix}` : kindTitle}
                </Text>

                <Box
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                  paddingBottom={3}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="blue100"
                    borderRadius="full"
                    flexShrink={0}
                    style={{ width: 56, height: 56 }}
                  >
                    <Icon
                      icon={isPhoneCall ? 'call' : 'reader'}
                      type="outline"
                      color="blue400"
                    />
                  </Box>
                  <Box>
                    {detail.registeredBy?.divisionName && (
                      <Text variant="small" fontWeight="semiBold">
                        {detail.registeredBy.divisionName}
                      </Text>
                    )}
                    <Box display="flex" alignItems="center" columnGap={1}>
                      {detail.dateTime && (
                        <Text variant="medium">
                          {formatDateWithTime(detail.dateTime)}
                        </Text>
                      )}
                      {detail.dateTime && detail.registeredBy?.name && (
                        <Text variant="medium" color="dark300">
                          |
                        </Text>
                      )}
                      {detail.registeredBy?.name && (
                        <Text variant="medium" color="dark400">
                          {detail.registeredBy.name}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <Box paddingY={2}>
                  <InfoRows rows={metaRows} />
                </Box>

                {middleRows.length > 0 && (
                  <>
                    <Divider />
                    <Box paddingY={2}>
                      <InfoRows rows={middleRows} />
                    </Box>
                  </>
                )}

                {(phoneCall
                  ? parsedPhoneCall?.result ??
                    (phoneCallRows.length === 0 ? phoneCall.text : undefined)
                  : detail.text) && (
                  <>
                    <Divider />
                    <Box paddingTop={2}>
                      <Box paddingY="p2">
                        <GridRow>
                          <GridColumn span={['12/12', '4/12']}>
                            <Text variant="medium" fontWeight="semiBold">
                              {formatMessage(
                                phoneCall && parsedPhoneCall?.result
                                  ? messages.pregnancyResult
                                  : messages.pregnancyDetailedDescription,
                              )}
                            </Text>
                          </GridColumn>
                          <GridColumn span={['12/12', '8/12']}>
                            <Text variant="medium" whiteSpace="preLine">
                              {phoneCall
                                ? parsedPhoneCall?.result ?? phoneCall.text
                                : detail.text}
                            </Text>
                          </GridColumn>
                        </GridRow>
                      </Box>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default PregnancyCommunicationDetail
