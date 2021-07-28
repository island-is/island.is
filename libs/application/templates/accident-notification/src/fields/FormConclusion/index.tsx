import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  Bullet,
  BulletList,
  Box,
  AccordionCard,
  Text,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { FamilyIllustration } from '../../assets'

export const FormConclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { title } = field
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginY={5}>
        <AlertMessage
          type="success"
          title="Tilkynning um slys hefur verið send til Sjúkratryggingar Íslands"
        />
      </Box>
      <AccordionCard
        id="conclusion.information"
        label={formatText(title, application, formatMessage)}
        labelVariant="h3"
        startExpanded
      >
        <Text marginBottom={[3, 3, 4]}>
          Hjá Sjúkratryggingum er umsóknin yfirfarin. Ef þörf er á er kallað
          eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa
          borist er afstaða tekin til bótaskyldu.
        </Text>
        <BulletList space={2} type="ul">
          <Bullet>
            Þriðji aðilli fer yfir tilkynninguna og staðfestir að allar
            upplýsingar eru réttar
          </Bullet>
          <Bullet>
            Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.
          </Bullet>
          <Bullet>
            Þegar öll nauðsynleg gögn hafa borist, fer Sjúkratryggingar Íslands
            yfir umsókn og er afstaða tekin til bótaskyldu.
          </Bullet>
          <Bullet>
            Þegar fallist hefur verið á að um bótaskylt slys samkvæmt
            almannatryggingalögum sé að ræða er hinn slasaði upplýstur um rétt
            sinn til greiðslu bóta.
          </Bullet>
        </BulletList>
      </AccordionCard>
      <Box marginTop={[5, 5, 6]} display="flex" justifyContent="center">
        <FamilyIllustration />
      </Box>
    </Box>
  )
}
