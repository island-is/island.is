import {
  Box,
  SkeletonLoader,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { useGetPregnancyMeasurementsQuery } from './Measurements.generated'
import * as styles from './Measurements.css'

const EMPTY_CELL = '–'

const Measurements = () => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetPregnancyMeasurementsQuery()

  const measurements =
    data?.healthDirectoratePregnancyMeasurements?.data ?? []

  return (
    <IntroWrapper
      title={messages.measurements}
      intro={messages.measurementsPregnancyIntro}
      childrenWidthFull
    >
      <Box marginTop={4}>
        {loading ? (
          <SkeletonLoader
            space={2}
            repeat={5}
            display="block"
            width="full"
            height={48}
          />
        ) : error ? (
          <Text as="p">{error.message}</Text>
        ) : (
          <T.Table box={{ className: styles.measurementsTable }}>
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
              {measurements.map((row, i) => (
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
        )}
      </Box>
    </IntroWrapper>
  )
}

export default Measurements
