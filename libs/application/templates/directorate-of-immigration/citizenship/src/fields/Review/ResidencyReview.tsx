import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { information, review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import { YES, getValueViaPath } from '@island.is/application/core'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const ResidencyReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  const countryOptions = getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as OptionSetItem[]

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <DescriptionText
          text={review.labels.residency}
          textProps={{
            as: 'h4',
            fontWeight: 'semiBold',
            marginBottom: 0,
          }}
        />
        <GridRow>
          {answers?.countriesOfResidence?.hasLivedAbroad === YES &&
          answers?.countriesOfResidence?.selectedAbroadCountries &&
          answers?.countriesOfResidence?.selectedAbroadCountries?.length > 0 ? (
            answers?.countriesOfResidence?.selectedAbroadCountries?.map(
              (country) => {
                const countryInfo = countryOptions.filter(
                  (z) => z.id?.toString() === country.countryId,
                )[0]
                return (
                  <GridColumn span="1/2">
                    <Text>{countryInfo.name}</Text>
                  </GridColumn>
                )
              },
            )
          ) : (
            <GridColumn>
              <Text>
                {formatMessage(information.labels.radioButtons.radioOptionNo)}
              </Text>
            </GridColumn>
          )}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
