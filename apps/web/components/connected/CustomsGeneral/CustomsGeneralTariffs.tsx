import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOMS_GENERAL_TARIFFS } from '@island.is/web/screens/queries/CustomsGeneral'
import { formatDate } from '@island.is/web/utils/formatDate'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { formatValidityDate } from './customsGeneralUtils'
import { m } from './translation.strings'
import { useDetailViewBack } from './useDetailViewBack'
import * as styles from './CustomsGeneralTariffs.css'

interface TariffItem {
  name: string
  description: string
  validFrom: string
  validTo: string
}

const LABEL_WIDTH = 220

interface DetailViewProps {
  item: TariffItem
  date: Date
  onBack: () => void
}

const TariffDetailView = ({ item, date, onBack }: DetailViewProps) => {
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
          {formatMessage(m.tariffBackToList)}
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
            <Text fontWeight="semiBold">{formatMessage(m.tariffName)}</Text>
          </Box>
          <Text>{item.name}</Text>
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

      {descriptionParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.tariffDescription)}
          </Text>
          {descriptionParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const CustomsGeneralTariffs = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedItem, setSelectedItem] = useState<TariffItem | null>(null)
  const handleBack = useDetailViewBack(!!selectedItem, () => setSelectedItem(null))

  const columns = [
    {
      key: 'name' as const,
      label: formatMessage(m.tariffName),
      render: (value: unknown) => (
        <span className={styles.link}>{String(value ?? '')}</span>
      ),
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_TARIFFS, {
    variables: { input: { date: toApiDate(selectedDate), system: 'U' } },
  })

  const items: TariffItem[] = (data?.customsGeneralTariffs ?? []).map(
    (item: Partial<TariffItem>) => ({
      name: item.name ?? '',
      description: item.description ?? '',
      validFrom: item.validFrom ?? '',
      validTo: item.validTo ?? '',
    }),
  )

  if (selectedItem) {
    return (
      <TariffDetailView
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
      onRowClick={(row) => setSelectedItem(row as TariffItem)}
    />
  )
}

export default CustomsGeneralTariffs
