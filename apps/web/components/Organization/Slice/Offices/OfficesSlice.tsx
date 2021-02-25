import React from 'react'
import { Offices } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { OfficeCard } from '@island.is/web/components'

interface SliceProps {
  slice: Offices
}

export const OfficesSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[4, 4, 6]}
          paddingBottom={[4, 5, 10]}
        >
          <Text
            variant="h3"
            as="h2"
            marginBottom={2}
            id={'sliceTitle-' + slice.id}
          >
            {slice.title}
          </Text>
          <GridContainer>
            <GridRow>
              {slice.offices.map((office, index) => (
                <GridColumn
                  span={['12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={1}
                  key={index}
                >
                  <OfficeCard
                    name={office.name as string}
                    address={office.address as string}
                    city={office.city as string}
                    openingHours={office.openingHours as string}
                  />
                </GridColumn>
              ))}
            </GridRow>
          </GridContainer>
        </Box>
      </GridContainer>
    </section>
  )
}
