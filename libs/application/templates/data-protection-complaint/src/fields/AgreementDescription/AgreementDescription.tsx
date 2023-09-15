import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { delimitation } from '../../lib/messages'
import { AgreementDescriptionBullet } from './AgreementDescriptionBullet'

export const AgreementDescription: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  return (
    <Box marginTop={3}>
      <Stack space={2}>
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletOne}
          link={delimitation.labels.agreementDescriptionBulletOneLink}
          linkName={delimitation.labels.agreementDescriptionBulletOneLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletTwo}
          link={delimitation.labels.agreementDescriptionBulletTwoLink}
          linkName={delimitation.labels.agreementDescriptionBulletTwoLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletThree}
          link={delimitation.labels.agreementDescriptionBulletThreeLink}
          linkName={delimitation.labels.agreementDescriptionBulletThreeLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletFour}
          link={delimitation.labels.agreementDescriptionBulletFourLink}
          linkName={delimitation.labels.agreementDescriptionBulletFourLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletFive}
          link={delimitation.labels.agreementDescriptionBulletFiveLink}
          linkName={delimitation.labels.agreementDescriptionBulletFiveLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletSix}
          link={delimitation.labels.agreementDescriptionBulletSixLink}
          linkName={delimitation.labels.agreementDescriptionBulletSixLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletSeven}
          link={delimitation.labels.agreementDescriptionBulletSevenLink}
          linkName={delimitation.labels.agreementDescriptionBulletSevenLinkName}
        />
        <AgreementDescriptionBullet
          summary={delimitation.labels.agreementDescriptionBulletEight}
          link={delimitation.labels.agreementDescriptionBulletEightLink}
          linkName={delimitation.labels.agreementDescriptionBulletEightLinkName}
        />
      </Stack>
    </Box>
  )
}
