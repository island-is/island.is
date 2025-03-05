import { AsyncSearchInput, Box } from '@island.is/island-ui/core'
import { useCallback, useState } from 'react'
import { FuseSearchOptions } from 'fuse.js'

export const SearchInput = () => {
  const [hasFocus, setHasFocus] = useState<boolean>(false)

  const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])
  const onFocus = useCallback(() => {
    setHasFocus(true)
  }, [setHasFocus])

  return (
    <AsyncSearchInput
      hasFocus
      inputProps={{
        inputSize: 'medium',
      }}
      buttonProps={{
        onClick: () => {
          console.log('Search button clicked')
        },
        onFocus,
        onBlur,
      }}
    />
  )
}
