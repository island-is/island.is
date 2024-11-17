import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { gridRow, summarySection } from './summaryStyles.css'
import { KeyValue } from './KeyValue'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'

type Props = {
  answers: RentalAgreement
}

export const LandlordInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const hasRepresentatives = answers.landlordInfo.table.some(
    (landlord) =>
      landlord.isRepresentative && landlord.isRepresentative.length > 0,
  )

  return (
    <>
      <Text variant="h5" as="h3">
        {formatMessage(summary.landlordsHeader)}
      </Text>
      <Box className={summarySection}>
        {answers.landlordInfo.table.length > 0 &&
          answers.landlordInfo.table
            .filter(
              (landlord) =>
                !landlord.isRepresentative ||
                landlord.isRepresentative.length === 0,
            )
            .map((landlord, index) => {
              return (
                <GridRow
                  key={`${index}_${landlord.nationalId}`}
                  className={gridRow}
                >
                  <GridColumn span={['12/12']}>
                    <KeyValue
                      labelVariant="h5"
                      labelAs="p"
                      label={landlord.name as string}
                      value={`${formatMessage(
                        summary.nationalIdLabel,
                      )}${formatNationalId(landlord.nationalId || '-')}`}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '6/12']}>
                    <KeyValue
                      label={summary.emailLabel}
                      value={landlord.email}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '6/12']}>
                    <KeyValue
                      label={summary.phoneNumberLabel}
                      value={formatPhoneNumber(landlord.phone || '-')}
                    />
                  </GridColumn>
                </GridRow>
              )
            })}
      </Box>

      {hasRepresentatives ? (
        <>
          <Text variant="h5" as="h3">
            {formatMessage(summary.landlordsRepresentativeLabel)}
          </Text>
          <Box className={summarySection}>
            {answers.landlordInfo.table.length > 0 &&
              answers.landlordInfo.table
                .filter(
                  (landlordRep) =>
                    landlordRep.isRepresentative &&
                    landlordRep.isRepresentative.length > 0,
                )
                .map((landlordRep, index) => {
                  return (
                    <GridRow
                      key={`${index}_${landlordRep.nationalId}`}
                      className={gridRow}
                    >
                      <GridColumn span={['12/12']}>
                        <KeyValue
                          labelVariant="h5"
                          labelAs="p"
                          label={landlordRep.name as string}
                          value={`${formatMessage(
                            summary.nationalIdLabel,
                          )}${formatNationalId(landlordRep.nationalId || '-')}`}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '6/12']}>
                        <KeyValue
                          label={summary.emailLabel}
                          value={landlordRep.email}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '6/12']}>
                        <KeyValue
                          label={summary.phoneNumberLabel}
                          value={formatPhoneNumber(landlordRep.phone || '-')}
                        />
                      </GridColumn>
                    </GridRow>
                  )
                })}
          </Box>
        </>
      ) : (
        ''
      )}
    </>
  )
}
