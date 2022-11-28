import {
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterProps,
  Checkbox,
  Stack,
  Text,
  Divider,
  Button,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import Card from '../components/Card/Card'
import { filterProps } from '../components/Filter/Utils/FilterOptions'
export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  const clearFilter = () => {
    console.log('clear')
  }
  type FilterItem = {
    value: string
    label: string | ReactNode
  }
  const filterItems: Array<FilterItem> = [{ value: 'hi', label: 'jo' }]

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
