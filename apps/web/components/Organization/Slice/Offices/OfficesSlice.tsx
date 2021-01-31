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
              {slice.offices.map((office) => (
                <GridColumn
                  span={['12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={1}
                >
                  <OfficeCard
                    name={office.name}
                    address={office.address}
                    city={office.city}
                    openingHours={office.openingHours}
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
