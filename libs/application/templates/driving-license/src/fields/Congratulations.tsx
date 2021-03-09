import React from 'react'

import {
  Box,
  BulletList,
  Bullet,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { m } from '../lib/messages'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={4}>
      <BulletList type="ul">
        <Bullet>
          {formatText(m.congratulationsBullet1, application, formatMessage)}
        </Bullet>
        <Bullet>
          {formatText(m.congratulationsBullet2, application, formatMessage)}
        </Bullet>
        <Bullet>
          {formatText(m.congratulationsBullet3, application, formatMessage)}
        </Bullet>
      </BulletList>
      <Box marginTop={8}>
        <img src="/assets/images/movingTruck.svg" alt="Skrautmynd" />
      </Box>
    </Box>
  )
}

export default Congratulations
