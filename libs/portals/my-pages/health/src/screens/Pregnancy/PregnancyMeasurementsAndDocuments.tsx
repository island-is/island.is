import { useMemo } from 'react'
import { Box, Stack, Tabs, Tag, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  createColumnHelper,
  formatDate,
  IntroWrapper,
  PortalTable,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { useGetActivePregnancyQuery } from './Pregnancy.generated'
import {
  GetPregnancyMeasurementsQuery,
  useGetPregnancyDocumentsQuery,
  useGetPregnancyMeasurementsQuery,
} from './PregnancyMeasurementsAndDocuments.generated'

type Measurement = NonNullable<
  GetPregnancyMeasurementsQuery['healthDirectoratePregnancyMeasurements']
>[number]

const columnHelper = createColumnHelper<Measurement>()

const MeasurementsTab = ({ pregnancyId }: { pregnancyId: string }) => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetPregnancyMeasurementsQuery({
    variables: { pregnancyId },
  })

  const measurements = data?.healthDirectoratePregnancyMeasurements ?? []

  const columns = useMemo(
    () => [
      columnHelper.accessor('examinationDate', {
        header: formatMessage(messages.pregnancyExaminationDate),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : '-'
        },
      }),
      columnHelper.accessor('weight', {
        header: formatMessage(messages.pregnancyWeight),
        cell: ({ getValue }) => {
          const value = getValue()
          return value != null ? `${value} kg` : '-'
        },
      }),
      columnHelper.accessor('cervixHeight', {
        header: formatMessage(messages.pregnancyCervixHeight),
        cell: ({ getValue }) => {
          const value = getValue()
          return value != null ? `${value} cm` : '-'
        },
      }),
      columnHelper.accessor(
        (row: Measurement) =>
          row.bloodPressureUpper != null && row.bloodPressureLower != null
            ? `${row.bloodPressureUpper}/${row.bloodPressureLower} mmHg`
            : undefined,
        {
          id: 'bloodPressure',
          header: formatMessage(messages.pregnancyBloodPressure),
          cell: ({ getValue }) => getValue() ?? '-',
        },
      ),
      columnHelper.accessor('pulse', {
        header: formatMessage(messages.pregnancyPulse),
        cell: ({ getValue }) => {
          const value = getValue()
          return value != null
            ? formatMessage(messages.pregnancyBeatsPerMinute, { value })
            : '-'
        },
      }),
      columnHelper.accessor('albumenInUrineScore', {
        header: formatMessage(messages.pregnancyAlbumenInUrine),
        cell: ({ getValue }) => {
          const value = getValue()
          if (!value) return '-'
          const normalized = value.trim().toLowerCase()
          return (
            <Tag
              variant={
                normalized === 'neikvætt'
                  ? 'mint'
                  : normalized === 'jákvætt'
                  ? 'red'
                  : 'blue'
              }
              outlined
              disabled
            >
              {value}
            </Tag>
          )
        },
      }),
    ],
    [formatMessage],
  )

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  return (
    <PortalTable
      columns={columns}
      data={measurements}
      loading={loading}
      emptyMessage={formatMessage(messages.noSearchResults)}
      mobileTitleKey="examinationDate"
    />
  )
}

const DocumentsTab = ({ pregnancyId }: { pregnancyId: string }) => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetPregnancyDocumentsQuery({
    variables: { pregnancyId },
  })

  const documents = data?.healthDirectoratePregnancyDocuments ?? []

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  if (loading) {
    return null
  }

  if (documents.length === 0) {
    return <Problem type="no_data" noBorder={false} />
  }

  return (
    <Stack space={2}>
      {documents.map((doc) => (
        <Box
          key={doc.id}
          border="standard"
          borderColor="blue200"
          borderRadius="large"
          padding={3}
        >
          {doc.organizationName && (
            <Text variant="eyebrow" color="purple400" marginBottom={1}>
              {doc.organizationName}
            </Text>
          )}
          <Text variant="h5">{doc.title}</Text>
          {doc.date && (
            <Text variant="medium" color="dark400">
              {formatMessage(messages.pregnancyDocumentSent, {
                date: formatDate(doc.date),
              })}
            </Text>
          )}
        </Box>
      ))}
    </Stack>
  )
}

const PregnancyMeasurementsAndDocuments = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const {
    data: pregnancyData,
    loading: pregnancyLoading,
    error: pregnancyError,
  } = useGetActivePregnancyQuery()

  const pregnancyId = pregnancyData?.healthDirectorateActivePregnancy?.id

  return (
    <IntroWrapper
      title={formatMessage(messages.pregnancyMeasurementsAndDocumentsCard)}
      intro={formatMessage(messages.pregnancyMeasurementsAndDocumentsIntro)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaPregnancyTooltip),
      }}
    >
      {pregnancyError && !pregnancyLoading ? (
        <Problem error={pregnancyError} noBorder={false} />
      ) : pregnancyLoading ? null : !pregnancyId ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <Tabs
          label={formatMessage(messages.pregnancyMeasurementsAndDocumentsCard)}
          contentBackground="transparent"
          selected="0"
          size="xs"
          tabs={[
            {
              label: formatMessage(messages.pregnancyMeasurementsTab),
              content: <MeasurementsTab pregnancyId={pregnancyId} />,
            },
            {
              label: formatMessage(messages.pregnancyDocumentsTab),
              content: <DocumentsTab pregnancyId={pregnancyId} />,
            },
          ]}
        />
      )}
    </IntroWrapper>
  )
}

export default PregnancyMeasurementsAndDocuments
