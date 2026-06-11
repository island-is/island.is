import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOMS_GENERAL_EXEMPTIONS } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'
import * as styles from './CustomsGeneralExemptions.css'

interface ExemptionItem {
  code: string
  name: string
  description: string
  legalArticle: string
  validFrom: string
  validTo: string
  system: string
}

const formatIsoDate = (iso?: string | null, fallback?: string): string => {
  if (!iso) return fallback ?? ''
  const d = new Date(iso)
  if (isNaN(d.getTime()) || d.getFullYear() > 9000) return fallback ?? ''
  return new Intl.DateTimeFormat('is-IS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

const LABEL_WIDTH = 160

interface DetailViewProps {
  item: ExemptionItem
  date: Date
  system: 'I' | 'U'
  onBack: () => void
}

const ExemptionDetailView = ({
  item,
  date,
  system,
  onBack,
}: DetailViewProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()

  const queryDate = new Intl.DateTimeFormat('is-IS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  const indefinite = formatMessage(m.exemptionIndefinite)
  const validFrom = formatIsoDate(item.validFrom, indefinite)
  const validTo = formatIsoDate(item.validTo, indefinite)
  const transportDirection =
    system === 'I'
      ? activeLocale === 'is'
        ? 'Innflutningur'
        : 'Import'
      : activeLocale === 'is'
      ? 'Útflutningur'
      : 'Export'

  const descriptionParagraphs = item.description
    ? item.description.split(/\n\n+/).filter(Boolean)
    : []
  const legalArticleParagraphs = item.legalArticle
    ? item.legalArticle.split(/\n\n+/).filter(Boolean)
    : []

  return (
    <Stack space={5}>
      <Box>
        <Button
          variant="text"
          size="small"
          preTextIcon="arrowBack"
          onClick={onBack}
        >
          {formatMessage(m.exemptionBackToList)}
        </Button>
      </Box>

      <Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flexStart"
          paddingBottom={2}
        >
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.exemptionDetailDate)}
            </Text>
          </Box>
          <Text>{queryDate}</Text>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="flexStart"
          paddingBottom={2}
        >
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.exemptionDetailTransportDirection)}
            </Text>
          </Box>
          <Text>{transportDirection}</Text>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="flexStart"
          paddingBottom={2}
        >
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.exemptionDetailValidityPeriod)}
            </Text>
          </Box>
          <Text>
            {validFrom} - {validTo}
          </Text>
        </Box>

        <Box display="flex" flexDirection="row" alignItems="flexStart">
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.exemptionColumnKey)}
            </Text>
          </Box>
          <Text>{item.code}</Text>
        </Box>
      </Box>

      {legalArticleParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.exemptionLegalArticle)}
          </Text>
          {legalArticleParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}

      {descriptionParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.exemptionDescription)}
          </Text>
          {descriptionParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const CustomsGeneralExemptions = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [system, setSystem] = useState<'I' | 'U'>('I')
  const [selectedItem, setSelectedItem] = useState<ExemptionItem | null>(null)

  const columns = [
    {
      key: 'code' as const,
      label: formatMessage(m.exemptionColumnKey),
      render: (value: unknown) => (
        <span className={styles.link}>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'description' as const,
      label: formatMessage(m.exemptionColumnDescription),
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_EXEMPTIONS, {
    variables: { input: { date: toApiDate(selectedDate), system } },
  })

  const items: ExemptionItem[] = (data?.customsGeneralExemptions ?? []).map(
    (item: Partial<ExemptionItem>) => ({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      legalArticle: item.legalArticle ?? '',
      validFrom: item.validFrom ?? '',
      validTo: item.validTo ?? '',
      system: item.system ?? '',
    }),
  )

  if (selectedItem) {
    return (
      <ExemptionDetailView
        item={selectedItem}
        date={selectedDate}
        system={system}
        onBack={() => setSelectedItem(null)}
      />
    )
  }

  return (
    <CustomsGeneralDateTable
      columns={columns}
      data={items}
      loading={loading}
      error={error}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      dateLabel={formatMessage(m.dateLabel)}
      errorTitle={formatMessage(m.errorTitle)}
      system={system}
      onSystemChange={setSystem}
      onRowClick={(row) => setSelectedItem(row as ExemptionItem)}
    />
  )
}

export default CustomsGeneralExemptions
