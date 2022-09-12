import { Box, Button, Input } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface SidebarShipSearchInputProps {
  shipDetailsHref?: string
}

export const SidebarShipSearchInput = ({
  shipDetailsHref = '/s/fiskistofa/skip',
}: SidebarShipSearchInputProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    return `${shipDetailsHref}?nr=${id}`
  }

  const search = () => {
    const searchValueIsNumber =
      !isNaN(Number(searchValue)) && searchValue.length > 0
    if (!searchValueIsNumber && searchValue.length < 2) {
      setInputError('Leitarstrengur þarf að vera a.m.k. 2 stafir')
      return
    } else {
      setInputError('')
    }
    if (searchValueIsNumber) {
      router.push(getShipDetailsHref(Number(searchValue)))
    } else {
      router.push('/s/fiskistofa/skipaleit' + '?name=' + searchValue)
    }
  }

  return (
    <Box width="full">
      <Input
        errorMessage={inputError}
        hasError={inputError.length > 0}
        name="fiskistofa-skipaleit-sidebar"
        label="Leitaðu að skipi"
        value={searchValue}
        onChange={(ev) => setSearchValue(ev.target.value)}
        icon="search"
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            search()
          }
        }}
      />
      <Box marginTop={2}>
        <Button size="small" onClick={search}>
          Leita
        </Button>
      </Box>
    </Box>
  )
}
