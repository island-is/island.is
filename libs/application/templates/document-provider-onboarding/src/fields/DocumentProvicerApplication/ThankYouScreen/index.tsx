import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Link } from '@island.is/island-ui/core'
import InfoScreen, { InfoScreenProps } from '../../components/InfoScreen'
import { m } from '../../../forms/messages'

const ThankYouScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return (
    <Box marginTop={[2, 3]}>
      <Box marginBottom={2}>
        {/* Todo setja þetta i messages */}
        <Text variant="h3">Nú bíður umsókn þín samþykkis island.is.</Text>
      </Box>
      <Box marginBottom={2}>
        {/* Todo setja þetta i messages */}
        <Text>
          Þegar og ef hún verður samþykkt, þarf að koma aftur inn í þetta ferli
          og klára umsóknina. Sá hluti er tæknilegur og krefst tæknilegrar
          útfærslu. Hér að neðan er að finna upplýsingar sem nauðsynlegt er að
          búið sé að kynna sér áður en farið er af stað í það ferli.
        </Text>
      </Box>
      <InfoScreen message={m.testPhaseInfoScreenMessage.defaultMessage} />
    </Box>
  )
}

export default ThankYouScreen
