import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, BulletList, Text, Bullet } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const Complete: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="h2">
        {formatText(m.completeFormTitle, application, formatMessage)}
      </Text>
      <BulletList>
        <Bullet>
          Starfsfólk mun fara yfir auglýsinguna og þú færð staðfestingu þegar
          auglýsingin þín fer í birtingu
        </Bullet>
        <Bullet>
          Ef auglýsingin þarfnast einhverra breytinga færð þú tilkynningu um
          það.
        </Bullet>
      </BulletList>
    </Box>
  )
}

export default Complete
