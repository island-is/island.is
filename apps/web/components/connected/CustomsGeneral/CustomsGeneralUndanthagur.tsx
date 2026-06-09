import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { GET_CUSTOMS_GENERAL_UNDANTHAGUR } from '@island.is/web/screens/queries/CustomsGeneral'

import { CustomsGeneralDateTable, toApiDate } from './CustomsGeneralDateTable'
import { m } from './translation.strings'
import * as styles from './CustomsGeneralUndanthagur.css'

interface UndanthagurItem {
  code: string
  name: string
  description: string
  lagaGrein: string
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
  item: UndanthagurItem
  date: Date
  kerfi: 'I' | 'U'
  onBack: () => void
}

const UndanthagurDetailView = ({
  item,
  date,
  kerfi,
  onBack,
}: DetailViewProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()

  const queryDate = new Intl.DateTimeFormat('is-IS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  const otimabundid = formatMessage(m.undanthagurOtimabundid)
  const validFrom = formatIsoDate(item.validFrom, otimabundid)
  const validTo = formatIsoDate(item.validTo, otimabundid)
  const flutningsleid =
    kerfi === 'I'
      ? activeLocale === 'is'
        ? 'Innflutningur'
        : 'Import'
      : activeLocale === 'is'
      ? 'Útflutningur'
      : 'Export'

  const descriptionParagraphs = item.description
    ? item.description.split(/\n\n+/).filter(Boolean)
    : []
  const lagaGreinParagraphs = item.lagaGrein
    ? item.lagaGrein.split(/\n\n+/).filter(Boolean)
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
          {formatMessage(m.undanthagurBackToList)}
        </Button>
      </Box>

      {/* Key-value info rows */}
      <Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flexStart"
          paddingBottom={2}
        >
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.undanthagurDetailDagsetning)}
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
              {formatMessage(m.undanthagurDetailFlutningsleid)}
            </Text>
          </Box>
          <Text>{flutningsleid}</Text>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="flexStart"
          paddingBottom={2}
        >
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.undanthagurDetailGildistimi)}
            </Text>
          </Box>
          <Text>
            {validFrom} - {validTo}
          </Text>
        </Box>

        {/* Lykill row */}
        <Box display="flex" flexDirection="row" alignItems="flexStart">
          <Box style={{ minWidth: LABEL_WIDTH }}>
            <Text fontWeight="semiBold">
              {formatMessage(m.undanthagurColumnLykill)}
            </Text>
          </Box>
          <Text>{item.code}</Text>
        </Box>
      </Box>

      {/* Lagagrein section */}
      {lagaGreinParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.undanthagurLagagrein)}
          </Text>
          {lagaGreinParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}

      {/* Lýsing section */}
      {descriptionParagraphs.length > 0 && (
        <Stack space={2}>
          <Text variant="h4" as="h3">
            {formatMessage(m.undanthagurLysing)}
          </Text>
          {descriptionParagraphs.map((para, i) => (
            <Text key={i}>{para.trim()}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const CustomsGeneralUndanthagur = () => {
  const { formatMessage } = useIntl()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [kerfi, setKerfi] = useState<'I' | 'U'>('I')
  const [selectedItem, setSelectedItem] = useState<UndanthagurItem | null>(null)

  const columns = [
    {
      key: 'code' as const,
      label: formatMessage(m.undanthagurColumnLykill),
      render: (value: unknown) => (
        <span className={styles.link}>{String(value ?? '')}</span>
      ),
    },
    {
      key: 'description' as const,
      label: formatMessage(m.undanthagurColumnSkyring),
    },
  ]

  const { data, loading, error } = useQuery(GET_CUSTOMS_GENERAL_UNDANTHAGUR, {
    variables: { input: { dags: toApiDate(selectedDate), kerfi } },
  })

  const items: UndanthagurItem[] = (data?.customsGeneralUndanthagur ?? []).map(
    (item: Partial<UndanthagurItem>) => ({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      lagaGrein: item.lagaGrein ?? '',
      validFrom: item.validFrom ?? '',
      validTo: item.validTo ?? '',
      system: item.system ?? '',
    }),
  )

  if (selectedItem) {
    return (
      <UndanthagurDetailView
        item={selectedItem}
        date={selectedDate}
        kerfi={kerfi}
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
      kerfi={kerfi}
      onKerfiChange={setKerfi}
      onRowClick={(row) => setSelectedItem(row as UndanthagurItem)}
    />
  )
}

export default CustomsGeneralUndanthagur
