import React from 'react'
import {
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Link,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { submitted } from '../../lib/messages'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'

export const Submitted = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <GridRow>
        <GridColumn span={['1/1', '8/12']}>
          <BulletList>
            <Bullet>
              {formatMessage(submitted.labels.descriptionBulletOne)}
            </Bullet>
            <Bullet>
              {formatMessage(submitted.labels.descriptionBulletTwo)}
            </Bullet>
            <Bullet>
              {formatMessage(submitted.labels.descriptionBulletThree, {
                tel: '847 3759',
              })}{' '}
              <Link href={`mailto:island@island.is`} color="blue400">
                island@island.is
              </Link>
            </Bullet>
          </BulletList>
        </GridColumn>
      </GridRow>
      <Box marginTop={[5, 8, 10]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
