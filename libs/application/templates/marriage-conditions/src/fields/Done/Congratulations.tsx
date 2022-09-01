import React from 'react'
import { Box, BulletList, Bullet } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { CopyLink } from '@island.is/application/ui-components'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Congratulations = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const spouseName = (application.answers.spouse as any)?.name ?? ''

  return (
    <Box>
      <Text variant="default" marginBottom={2}>
        Umsókn þín um könnun hjónavígsluskilyrða hefur nú verið send á þinn
        maka.
      </Text>
      <Text variant="h3" marginBottom={2}>
        Næstu skref
      </Text>
      <BulletList type={'ul'} space={2}>
        <Bullet>{spouseName} þarf að fylla út sinn hluta umsóknarinnar.</Bullet>
        <Bullet>
          Ef maki þinn tekur ekki afstöðu til samningsins innan 60 daga þarf að
          hefja umsóknarferlið að nýju á Ísland.is.
        </Bullet>
        <Bullet>
          Könnunarvottorð frá sýslumanni gildir í 30 daga frá útgáfudegi.
        </Bullet>
        <Bullet>
          Könnunarvottorð verður sent í pósthólf ykkar beggja á island.is og þið
          berið ábyrgð á því að afhenda vígsluaðila vottorðið fyrir
          hjónavígsluna.
        </Bullet>
      </BulletList>

      <Box marginTop={3}>
        <Text variant="h4">Deila hlekk</Text>
        <Box marginTop={2}>
          <CopyLink
            linkUrl={
              `${document.location.origin}/hjonavigsla/` + application.id
            }
            buttonTitle={'Afrita hlekk'}
          />
        </Box>
      </Box>
    </Box>
  )
}
