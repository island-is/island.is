import { ReactNode } from 'react'
import { ArrowLink as IslandUIArrowLink } from '@island.is/island-ui/core'

interface Props {
  isReadMore?: boolean
}

export const ArrowLink = ({ isReadMore }: Props) => {
  return (
    <IslandUIArrowLink
      href={
        isReadMore
          ? '/um'
          : 'https://www.stjornarradid.is/rikisstjorn/thingmalaskra/'
      }
    >
      {isReadMore ? 'Lesa meira' : 'Skoða þingmálaskrá ríkisstjórnar'}
    </IslandUIArrowLink>
  )
}

export default ArrowLink
