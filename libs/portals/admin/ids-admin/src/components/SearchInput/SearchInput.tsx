import React from 'react'

import { Box, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

import * as styles from './SearchInput.css'

interface SearchInputProps {
  inputSearchValue: string
  onChange(value: string): void
}

export const SearchInput = ({
  inputSearchValue,
  onChange,
}: SearchInputProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.filterContainer} marginBottom={3}>
      <FilterInput
        placeholder={formatMessage(m.searchPlaceholder)}
        name="search"
        value={inputSearchValue}
        onChange={onChange}
        backgroundColor="blue"
      />
    </Box>
  )
}
