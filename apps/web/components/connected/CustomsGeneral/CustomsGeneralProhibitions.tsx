import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOMS_GENERAL_PROHIBITIONS } from '@island.is/web/screens/queries/CustomsGeneral'
import { formatDate } from '@island.is/web/utils/formatDate'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { formatValidityDate } from './customsGeneralUtils'
import { m } from './translation.strings'
import { useDetailViewBack } from './useDetailViewBack'
import * as styles from './CustomsGeneralProhibitions.css'

interface ProhibitionItem {
  code: string
  name: string
  description: string
  exemptionProvider: string
  validFrom: string
  validTo: string
}

const LABEL_WIDTH = 220

interface DetailViewProps {
  item: ProhibitionItem
  date: Date
  onBack: () => void
}

const ProhibitionDetailView = ({ item, date, onBack }: DetailViewProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()

  const queryDate = formatDate(date, activeLocale, 'dd.MM.yyyy') ?? ''
  const indefinite = formatMessage(m.exemptionIndefinite)
  const validFrom = formatValidityDate(item.validFrom, indefinite, activeLocale)
  const validTo = formatValidityDate(item.validTo, indefinite, activeLocale)

  const descriptionParagraphs = item.description
    ? item.description.split(/\n\n+/).filter(Boolean)
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
          {formatMessage(m.prohibitionBackToList)}
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
            <Text fontWeight="semiBold">{formatMessage(m.dateLabel)}</Text>
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
              {formatMessage(m.exemptionColumnKey)}
            </Text>
          </Box>
          <Text>{item.code}</Text>
        </Box>

        {item.validFrom && (
          <Box display="flex" flexDirection="row" alignItems="flexStart">
            <Box style={{ minWidth: LABEL_WIDTH }}>
              <Text fontWeight="semiBold">
                {formatMessage(m.exemptionDetailValidityPeriod)}
              </Text>
            </Box>
            <Text>
              {validFrom} - {validTo}
            </Text>
          </Box>
        )}
      </Box>

      {item.exemptionProvider && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.prohibitionExemptionProvider)}
          </Text>
          <Text>{item.exemptionProvider}</Text>
        </Stack>
      )}

      {descriptionParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.prohibitionReason)}
          </Text>
          {descriptionParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const CustomsGeneralProhibitions = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedItem, setSelectedItem] = useState<ProhibitionItem | null>(null)
  const handleBack = useDetailViewBack(!!selectedItem, () =>
    setSelectedItem(null),
  )

  const columns = [
    {
      key: 'code' as const,
      label: formatMessage(m.exemptionColumnKey),
      render: (value: unknown) => (
        <span className={styles.link}>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'name' as const,
      label: formatMessage(m.exemptionColumnDescription),
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_PROHIBITIONS, {
    variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
  })

  const items: ProhibitionItem[] = (data?.customsGeneralProhibitions ?? []).map(
    (item: Partial<ProhibitionItem>) => ({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      exemptionProvider: item.exemptionProvider ?? '',
      validFrom: item.validFrom ?? '',
      validTo: item.validTo ?? '',
    }),
  )

  if (selectedItem) {
    return (
      <ProhibitionDetailView
        item={selectedItem}
        date={selectedDate}
        onBack={handleBack}
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
      onRowClick={(row) => setSelectedItem(row as ProhibitionItem)}
    />
  )
}

export default CustomsGeneralProhibitions
