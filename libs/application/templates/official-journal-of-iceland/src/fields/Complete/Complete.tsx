import { FieldBaseProps } from '@island.is/application/types'
import { Box, Bullet, BulletList } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { CompleteImage } from '../../assets/CompleteImage'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'
import * as styles from './Complete.css'

export const Complete: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { f } = useFormatMessage(application)

  return (
    <Box>
      <FormIntro title={f(m.completeFormTitle)} />
      <Box marginBottom={10}>
        <BulletList>
          <Bullet>{f(m.completeBulletOne)}</Bullet>
          <Bullet>{f(m.completeBulletTwo)}</Bullet>
        </BulletList>
      </Box>
      <Box className={styles.svgWrap}>
        <CompleteImage />
      </Box>
    </Box>
  )
}

export default Complete
