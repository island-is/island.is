import React from 'react'
import { BulletList } from './BulletList'
import { Box } from '../Box'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'Components/BulletList',
  component: BulletList,
}

export const Default = () => {
  const type = boolean('Ordered (numbered) list', false)

  return (
    <Box padding="gutter">
      <BulletList type={type ? 'ol' : 'ul'}>
        <li>
          Réttur til fæðingarorlofs vegna fæðingar fellur niður er barnið nær 24
          mánaða aldri.
        </li>
        <li>
          Réttur til fæðingarorlofs vegna ættleiðingar eða varanlegs fóstur
          fellur niður 24 mánuðum eftir að barnið kom inn á heimilið.
        </li>
        <li>
          Réttur foreldris til fæðingarorlofs er bundinn því að það fari sjálft
          með forsjá barnsins eða hafi sameiginlega forsjá ásamt hinu foreldri
          þess þegar taka fæðingarorlofs hefst.
        </li>
      </BulletList>
    </Box>
  )
}
