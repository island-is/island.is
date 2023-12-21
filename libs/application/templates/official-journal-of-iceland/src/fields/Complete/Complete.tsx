import { Box, Bullet, BulletList } from '@island.is/island-ui/core'
import { CompleteImage } from '../../assets/CompleteImage'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { complete } from '../../lib/messages/complete'
import { OJOIFieldBaseProps } from '../../lib/types'
import * as styles from './Complete.css'

export const Complete = ({ application }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  return (
    <Box>
      <FormIntro title={f(complete.general.formTitle)} />
      <Box marginBottom={10}>
        <BulletList>
          <Bullet>{f(complete.bullets.first)}</Bullet>
          <Bullet>{f(complete.bullets.second)}</Bullet>
        </BulletList>
      </Box>
      <Box className={styles.svgWrap}>
        <CompleteImage />
      </Box>
    </Box>
  )
}

export default Complete
