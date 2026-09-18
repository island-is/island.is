import { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDateWithTime,
  IntroWrapper,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { useGetActivePregnancyQuery } from './Pregnancy.generated'
import { useGetPregnancyCommunicationDetailQuery } from './PregnancyCommunicationDetail.generated'

type UseParams = {
  id: string
}

interface InfoRow {
  label: string
  value?: ReactNode
}

const InfoRows = ({ rows }: { rows: InfoRow[] }) => (
  <Stack space={2}>
    {rows.map((row) => (
      <GridRow key={row.label}>
        <GridColumn span={['12/12', '4/12']}>
          <Text variant="medium" fontWeight="semiBold">
            {row.label}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '8/12']}>
          {typeof row.value === 'string' ? (
            <Text variant="medium">{row.value}</Text>
          ) : (
            row.value
          )}
        </GridColumn>
      </GridRow>
    ))}
  </Stack>
)

const PregnancyCommunicationDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

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

  const reason =
    detail?.subjectTerm ??
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

  const checklistRows: InfoRow[] = phoneCall
    ? Object.entries((phoneCall.checklist as Record<string, unknown>) ?? {})
        .filter(
          ([, value]) =>
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean',
        )
        .map(([key, value]) => ({
          label: key,
          value: String(value),
        }))
    : []

  const middleRows = examination ? examinationRows : checklistRows

  return (
    <IntroWrapper
      title={
        detail?.subjectTerm ? `${kindTitle}: ${detail.subjectTerm}` : kindTitle
      }
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaPregnancyTooltip),
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <CardLoader />
      ) : !detail ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <>
          <Box display="flex" alignItems="center" columnGap={2} marginBottom={3}>
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
                icon={isPhoneCall ? 'call' : 'reader'}
                type="outline"
                color="blue400"
              />
            </Box>
            <Box>
              {detail.registeredBy?.divisionName && (
                <Text variant="medium" fontWeight="semiBold">
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
                  <Text variant="medium">{detail.registeredBy.name}</Text>
                )}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box marginY={3}>
            <InfoRows rows={metaRows} />
          </Box>

          {middleRows.length > 0 && (
            <>
              <Divider />
              <Box marginY={3}>
                <InfoRows rows={middleRows} />
              </Box>
            </>
          )}

          {detail.text && (
            <>
              <Divider />
              <Box marginTop={3}>
                <GridRow>
                  <GridColumn span={['12/12', '4/12']}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(messages.pregnancyDetailedDescription)}
                    </Text>
                  </GridColumn>
                  <GridColumn span={['12/12', '8/12']}>
                    <Text variant="medium">{detail.text}</Text>
                  </GridColumn>
                </GridRow>
              </Box>
            </>
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default PregnancyCommunicationDetail
