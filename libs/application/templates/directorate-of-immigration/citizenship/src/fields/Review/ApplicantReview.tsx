import { FieldBaseProps } from '@island.is/application/types'
import React, { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { personal, review } from '../../lib/messages'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import * as kennitala from 'kennitala'

export const ApplicantReview:FC<FieldBaseProps> = ({ application }) => {
    console.log('application', application)
    const answers = application.answers as Citizenship
    const { formatMessage } = useLocale()
    
    return (
        <Box paddingBottom={4} paddingTop={4}>
            <DescriptionText 
                text={review.labels.applicant}
                textProps={{
                    as: 'h4',
                    fontWeight: 'semiBold',
                    marginBottom:0
                }}
            />
            <GridRow>
                <GridColumn span='1/2'>
                    <Text>
                        {answers?.userInformation?.name}
                    </Text>
                    <Text>
                        {kennitala.format(answers?.userInformation?.nationalId)}
                    </Text>
                    <Text>
                        {answers?.userInformation?.email}
                    </Text>
                    <Text>
                        {`${formatMessage(personal.labels.userInformation.citizenship)}: ${answers?.userInformation?.citizenship}`}
                    </Text>
                    <Text>
                        {`${formatMessage(personal.labels.userInformation.birthCountry)}: ${answers?.userInformation?.birthCountry}`}
                    </Text>
                </GridColumn>
                <GridColumn span='1/2'>
                    <Text>
                        {answers?.userInformation?.address}
                    </Text>
                    <Text>
                        {answers?.userInformation?.postalCode}
                    </Text>
                    <Text>
                        {answers?.userInformation?.phone}
                    </Text>
                    <Text>
                        {`${formatMessage(personal.labels.userInformation.residenceInIcelandLastChangeDate)}: ${answers?.userInformation?.residenceInIcelandLastChangeDate}`}
                    </Text>
                </GridColumn>
            </GridRow>
        </Box>
    )
}