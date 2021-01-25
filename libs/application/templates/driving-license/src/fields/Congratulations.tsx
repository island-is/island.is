import React from 'react'

import {
  Box,
  BulletList,
  Bullet,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { CustomField, FieldBaseProps } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  return (
    <Box paddingTop={4}>
      <BulletList type="ul">
        <Bullet>Umsókn þín um almenn ökuréttindi hefur verið staðfest</Bullet>
        <Bullet>
          Þú munt fá póst á skráð netfang þegar ökuskírteini er gefið út
        </Bullet>
        <Bullet>Hægt er að fylgjast með virkum umsóknum á Mínum síðum</Bullet>
      </BulletList>
      <Box marginTop={8}>
        <img src="/assets/images/movingTruck.svg" alt="Skrautmynd" />
      </Box>
    </Box>
  )
}

export default Congratulations
