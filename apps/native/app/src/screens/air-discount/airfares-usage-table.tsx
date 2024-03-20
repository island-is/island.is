import React from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components/native'

import { Typography, dynamicColor } from '@ui'
import { GetAirDiscountFlightLegsQuery } from '../../graphql/types/schema'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
`

const FlightLeg = styled.View`
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[3]}px;
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

const Info = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

interface AirDiscountProps {
  data: GetAirDiscountFlightLegsQuery['airDiscountSchemeUserAndRelationsFlights']
}

export function AirfaresUsageTable({ data }: AirDiscountProps) {
  return (
    <Host>
      {data &&
        data.map((flightLeg, index) => {
          return (
            <FlightLeg key={`airfare-usage-flight-${index}`}>
              <Info>
                <Typography variant="body3">
                  {flightLeg.flight.user.name}
                </Typography>
                {flightLeg.flight.bookingDate && (
                  <Typography variant="body3">
                    <FormattedDate
                      value={flightLeg.flight.bookingDate}
                      day="numeric"
                      month="long"
                    />
                    {' - '}
                    <FormattedTime value={flightLeg.flight.bookingDate} />
                  </Typography>
                )}
              </Info>
              <Typography variant="heading5" style={{ marginTop: 4 }}>
                {flightLeg.travel}
              </Typography>
            </FlightLeg>
          )
        })}
    </Host>
  )
}
