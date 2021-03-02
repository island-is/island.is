import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Bullet, BulletList, Stack, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import InstitutionIllustration from '../../assets/InstitutionIllustration'

const ConfirmationScreen: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={6}>
        <BulletList>
          <Bullet>
            Við munum nú fara yfir verkefnið og við sendum á þig svör innan
            tíðar.{' '}
          </Bullet>
          <Bullet>
            Við verðum í sambandi ef okkur vantar frekari upplýsingar.{' '}
          </Bullet>
          <Bullet>
            Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847
            3759 eða á netfangið{' '}
            <Link href="mailto:island@island.is" color="blue400">
              island@island.is
            </Link>
          </Bullet>
        </BulletList>
        <Box display="flex" justifyContent="center" size={1}>
          <InstitutionIllustration />
        </Box>
      </Stack>
    </Box>
  )
}

export default ConfirmationScreen
