import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { GET_CUSTOMS_GENERAL_CHARGES } from '@island.is/web/screens/queries/CustomsGeneral'
import { formatCurrency } from '@island.is/web/utils/currency'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { formatValidityDate } from './customsGeneralUtils'
import { m } from './translation.strings'
import { useDetailViewBack } from './useDetailViewBack'
import * as styles from './CustomsGeneralCharges.css'

interface ChargeItem {
  code: string
  name: string
  description: string
  validFrom: string
  validTo: string
  taxtiUpphaed: string
  taxtiProsenta: string
}

const LABEL_WIDTH = 220

interface DetailViewProps {
  item: ChargeItem
  date: Date
  onBack: () => void
}

const ChargeDetailView = ({ item, date, onBack }: DetailViewProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  const queryDate = format(date, 'dd.MM.yyyy') ?? ''
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
          {formatMessage(m.chargesBackToList)}
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
        )}

        {item.taxtiUpphaed && !isNaN(parseFloat(item.taxtiUpphaed)) && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flexStart"
            paddingBottom={2}
          >
            <Box style={{ minWidth: LABEL_WIDTH }}>
              <Text fontWeight="semiBold">{formatMessage(m.chargesTaxti)}</Text>
            </Box>
            <Text>{formatCurrency(parseFloat(item.taxtiUpphaed))}</Text>
          </Box>
        )}

        {item.taxtiProsenta && item.taxtiProsenta !== '0' && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flexStart"
            paddingBottom={2}
          >
            <Box style={{ minWidth: LABEL_WIDTH }}>
              <Text fontWeight="semiBold">{formatMessage(m.chargesTaxti)}</Text>
            </Box>
            <Text>{item.taxtiProsenta} %</Text>
          </Box>
        )}
      </Box>

      {descriptionParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.chargesDescription)}
          </Text>
          {descriptionParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const CustomsGeneralCharges = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedItem, setSelectedItem] = useState<ChargeItem | null>(null)
  useDetailViewBack(!!selectedItem, () => setSelectedItem(null))

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

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_CHARGES, {
    variables: { input: { date: toApiDate(selectedDate), system: 'I' } },
  })

  const items: ChargeItem[] = (data?.customsGeneralCharges ?? []).map(
    (item: Partial<ChargeItem>) => ({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      validFrom: item.validFrom ?? '',
      validTo: item.validTo ?? '',
      taxtiUpphaed: item.taxtiUpphaed ?? '',
      taxtiProsenta: item.taxtiProsenta ?? '',
    }),
  )

  if (selectedItem) {
    return (
      <ChargeDetailView
        item={selectedItem}
        date={selectedDate}
        onBack={() => window.history.back()}
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
      onRowClick={(row) => setSelectedItem(row as ChargeItem)}
    />
  )
}

export default CustomsGeneralCharges
