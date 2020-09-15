import React from 'react'
import { Controller } from 'react-hook-form'

import { Box, Checkbox } from '@island.is/island-ui/core'

interface PropTypes {
  options: {
    label: string
    value: string
  }[]
  name: string
}

function CheckBox({ options, name }: PropTypes) {
  return (
    <Controller
      defaultValue=""
      name={name}
      render={({ onChange, value }) => (
        <Box display="flex" flexWrap="wrap">
          {options.map((option, i) => (
            <Box
              key={i}
              marginRight={i === options.length - 1 ? 0 : 4}
              marginBottom={2}
            >
              <Checkbox
                onChange={(e) => {
                  const val = Array.isArray(value) ? value : []
                  onChange([
                    ...val.filter((c) => c !== option.value),
                    ...(e.target.checked ? [option.value] : []),
                  ])
                }}
                checked={value && value.includes(option.value)}
                name={option.value}
                value={option.value}
                label={option.label}
              />
            </Box>
          ))}
        </Box>
      )}
    />
  )
}

export default CheckBox
