import React from 'react'

import { BulletList, Bullet } from './BulletList'
import { Box } from '../Box/Box'

export default {
  title: 'Components/BulletList',
  component: BulletList,
}

export const Default = ({ type }) => (
  <Box padding="gutter">
    <BulletList type={type ? 'ol' : 'ul'}>
      <Bullet>
        Réttur til fæðingarorlofs vegna fæðingar fellur niður er barnið nær 24
        mánaða aldri.
      </Bullet>
      <Bullet>
        Réttur til fæðingarorlofs vegna ættleiðingar eða varanlegs fóstur fellur
        niður 24 mánuðum eftir að barnið kom inn á heimilið.
      </Bullet>
      <Bullet>
        Réttur foreldris til fæðingarorlofs er bundinn því að það fari sjálft
        með forsjá barnsins eða hafi sameiginlega forsjá ásamt hinu foreldri
        þess þegar taka fæðingarorlofs hefst.
      </Bullet>
    </BulletList>
  </Box>
)

Default.args = {
  type: false,
}

export const Nested = () => (
  <Box padding="gutter">
    <BulletList type="ul">
      <Bullet>
        First bullet
        <Bullet>Nested bullet</Bullet>
      </Bullet>
    </BulletList>
  </Box>
)
