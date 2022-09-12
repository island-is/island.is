import { Input } from '@island.is/island-ui/core'
import { useState } from 'react'

export const SidebarShipSearchInput = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Input
      name="fiskistofa-skipaleit-sidebar"
      label="Leitaðu að skipi"
      value={searchValue}
      onChange={(ev) => setSearchValue(ev.target.value)}
      icon="search"
    />
  )
}
