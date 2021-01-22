import React from 'react'
import { Box, BulletList, Bullet } from '@island.is/island-ui/core'

const Confirmation = () => {
  return (
    <Box marginTop={4}>
      <BulletList type="ul">
        <Bullet>
          Hitt foreldrið verður að samþykkja breytingar á lögheimili með
          rafrænni undirritun.
        </Bullet>
        <Bullet>
          Eftir að hitt foreldrið samþykkir eða hafnar breytingu á lögheimili
          fer málið til afgreiðslu hjá sýslumanni.
        </Bullet>
        <Bullet>
          Sýslumaður mun hafa samband við þig varðandi viðtöl eða ef þörf er á
          frekari upplýsingum.
        </Bullet>
      </BulletList>
    </Box>
  )
}

export default Confirmation
