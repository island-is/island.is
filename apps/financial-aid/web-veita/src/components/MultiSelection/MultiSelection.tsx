import React from 'react'
import { Box, Option, Select, Text, Icon } from '@island.is/island-ui/core'
import * as styles from './MultiSelection.css'

import cn from 'classnames'

interface Props {
  options: Option[]
  active: Option[]
}

const MultiSelection = ({ options, active }: Props) => {
  console.log(active)
  return (
    <Box className={styles.selectContainer}>
      <Select
        label="Sveitarfélög"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        options={options}
        placeholder="Veldu tegund"
        // hasError={!addedServiceCenter.label && !addedServiceCenter.value}
        // errorMessage="Þú þarft að velja sveitarfélag"
        // value={addedServiceCenter}
        onChange={(option) => {
          console.log(option)
          // setAddedServiceCenter(option as Option)
          // if (option?.value as Option) {
          //   setState({
          //     ...state,
          //     municipalityIds: [...state.municipalityIds, option?.value],
          //     serviceCenter: state.serviceCenter.filter(
          //       (el) => el.value !== option.value,
          //     ),
          //   })
          // }
        }}
      />
      <Box>
        {active.map((muni, index) => {
          return (
            <button key={'muni-tags-' + index} className={styles.tags}>
              <Box
                display="flex"
                alignItems="center"
                padding={1}
                borderRadius="standard"
              >
                <Box marginRight={1}>
                  <Text color="blue400" fontWeight="semiBold" variant="small">
                    {muni.label}
                  </Text>
                </Box>

                <Icon icon="close" color="blue300" size="small" />
              </Box>
            </button>
          )
        })}
      </Box>
    </Box>
  )
}

export default MultiSelection
