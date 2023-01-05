import React from 'react'
import {
  Box,
  Filter,
  FilterMultiChoice,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import Card from '../components/Card/Card'
import { filterProps } from '../components/Filter/Utils/FilterOptions'
export async function getStaticProps(context) {
  console.log(context)
  console.log('test')
  return {
    props: {}, // will be passed to the page component as props
  }
}
export const Index = () => {
  const clearFilter = () => {
    console.log('clear')
  }
  type FilterItem = {
    value: string
    label: string | ReactNode
  }
  const filterItems: Array<FilterItem> = [{ value: 'item', label: 'item 1' }]

  return (
    <div>
      <GridRow>
        <GridColumn span="3/12">
          <Filter {...filterProps(clearFilter)}>
            <Box
              borderColor="blue300"
              borderWidth="standard"
              padding={3}
              borderStyle="solid"
              borderRadius="standard"
            >
              <FilterMultiChoice
                labelClear="Hreinsa val"
                onChange={({ categoryId, selected }) =>
                  console.log(selected, categoryId)
                }
                onClear={(categoryId) => console.log(categoryId)}
                categories={[
                  {
                    id: '1',
                    label: 'Staða',
                    selected: [],
                    filters: filterItems,
                  },
                ]}
              ></FilterMultiChoice>
            </Box>
            <Box
              borderColor="blue300"
              borderWidth="standard"
              padding={3}
              borderStyle="solid"
              borderRadius="standard"
            >
              <FilterMultiChoice
                labelClear="Hreinsa val"
                onChange={({ categoryId, selected }) =>
                  console.log(selected, categoryId)
                }
                onClear={(categoryId) => console.log(categoryId)}
                categories={[
                  {
                    id: '2',
                    label: 'Staða máls',
                    selected: [],
                    filters: filterItems,
                  },
                ]}
              ></FilterMultiChoice>
            </Box>
            <Box
              borderColor="blue300"
              borderWidth="standard"
              padding={3}
              borderStyle="solid"
              borderRadius="standard"
            >
              <FilterMultiChoice
                labelClear="Hreinsa val"
                onChange={({ categoryId, selected }) =>
                  console.log(selected, categoryId)
                }
                onClear={(categoryId) => console.log(categoryId)}
                categories={[
                  {
                    id: '2',
                    label: 'Staða',
                    selected: [],
                    filters: filterItems,
                  },
                ]}
              ></FilterMultiChoice>
            </Box>
          </Filter>
        </GridColumn>
        <GridColumn span="9/12">
          <Box>
            <Card></Card>
          </Box>
        </GridColumn>
      </GridRow>
    </div>
  )
}

export default Index
