import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { information, review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'

export const StaysAbroadReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <DescriptionText
        text={review.labels.abroadStays}
        textProps={{
          as: 'h4',
          fontWeight: 'semiBold',
          marginBottom: 0,
        }}
      />
      <GridRow>
        {answers?.staysAbroad?.hasStayedAbroad &&
        answers?.staysAbroad?.selectedAbroadCountries &&
        answers?.staysAbroad?.selectedAbroadCountries?.length > 0 ? (
          answers?.staysAbroad?.selectedAbroadCountries?.map((country) => {
            return (
              <GridColumn span="1/2">
                <Text>{country.country}</Text>
              </GridColumn>
            )
          })
        ) : (
          <GridColumn>
            <Text>
              {formatMessage(information.labels.radioButtons.radioOptionNo)}
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Box>
  )
}
