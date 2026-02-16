import { Box, Table as T, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'

type ProteinResult = 'negative' | null

interface MeasurementRow {
  date: string
  weightKg: number | null
  fundalHeightCm: number | null
  bloodPressure: string | null
  pulsePerMin: number | null
  proteinInUrine: ProteinResult
}

const MOCK_MEASUREMENTS: MeasurementRow[] = [
  {
    date: '18.02.2025',
    weightKg: 77,
    fundalHeightCm: 20,
    bloodPressure: '114/73',
    pulsePerMin: 103,
    proteinInUrine: 'negative',
  },
  {
    date: '12.02.2025',
    weightKg: null,
    fundalHeightCm: null,
    bloodPressure: null,
    pulsePerMin: null,
    proteinInUrine: null,
  },
  {
    date: '11.02.2025',
    weightKg: 77,
    fundalHeightCm: null,
    bloodPressure: null,
    pulsePerMin: null,
    proteinInUrine: 'negative',
  },
  {
    date: '07.01.2025',
    weightKg: 75,
    fundalHeightCm: null,
    bloodPressure: '111/77',
    pulsePerMin: 77,
    proteinInUrine: 'negative',
  },
]

const EMPTY_CELL = '–'

const Measurements = () => {
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={messages.measurements}
      intro={messages.measurementsPregnancyIntro}
      childrenWidthFull
    >
      <Box marginTop={4}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.date)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.measurementWeight)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.measurementFundalHeight)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.measurementBloodPressure)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.measurementPulse)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(messages.measurementProteinInUrine)}
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {MOCK_MEASUREMENTS.map((row, i) => (
              <T.Row key={`${row.date}-${i}`}>
                <T.Data>
                  <Text variant="medium" as="span">
                    {row.date}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium" as="span">
                    {row.weightKg != null
                      ? `${row.weightKg} ${formatMessage(
                          messages.measurementUnitKg,
                        )}`
                      : EMPTY_CELL}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium" as="span">
                    {row.fundalHeightCm != null
                      ? `${row.fundalHeightCm} ${formatMessage(
                          messages.measurementUnitCm,
                        )}`
                      : EMPTY_CELL}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium" as="span">
                    {row.bloodPressure != null
                      ? `${row.bloodPressure} ${formatMessage(
                          messages.measurementUnitMmHg,
                        )}`
                      : EMPTY_CELL}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium" as="span">
                    {row.pulsePerMin != null
                      ? `${row.pulsePerMin} ${formatMessage(
                          messages.measurementUnitPulse,
                        )}`
                      : EMPTY_CELL}
                  </Text>
                </T.Data>
                <T.Data>
                  {row.proteinInUrine === 'negative' ? (
                    <Tag variant="mint" outlined disabled>
                      {formatMessage(messages.measurementProteinNegative)}
                    </Tag>
                  ) : (
                    <Text variant="medium" as="span">
                      {EMPTY_CELL}
                    </Text>
                  )}
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </Box>
    </IntroWrapper>
  )
}

export default Measurements
