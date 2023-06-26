import { FormatMessage } from '@island.is/localization'
import { delimitation, externalData } from '../../lib/messages'

export const getExternalData = (formatMessage: FormatMessage) => {
  return {
    title: formatMessage(externalData.general.pageTitle),
    subtitle: formatMessage(externalData.general.subTitle),
    description: formatMessage(externalData.general.description),
    nationalRegistryTitle: formatMessage(
      externalData.labels.nationalRegistryTitle,
    ),
    nationalRegistryDescription: formatMessage(
      externalData.labels.nationalRegistrySubTitle,
    ),
    userProfileTitle: formatMessage(externalData.labels.userProfileTitle),
    userProfileDescription: formatMessage(
      externalData.labels.userProfileSubTitle,
    ),
    checkboxText: formatMessage(externalData.general.checkboxLabel),
  }
}

export const getBullets = (formatMessage: FormatMessage) => {
  return {
    bulletOne: {
      bullet: formatMessage(delimitation.labels.agreementDescriptionBulletOne),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletOneLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletOneLinkName,
      ),
    },
    bulletTwo: {
      bullet: formatMessage(delimitation.labels.agreementDescriptionBulletTwo),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletTwoLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletTwoLinkName,
      ),
    },
    bulletThree: {
      bullet: formatMessage(
        delimitation.labels.agreementDescriptionBulletThree,
      ),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletThreeLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletThreeLinkName,
      ),
    },
    bulletFour: {
      bullet: formatMessage(delimitation.labels.agreementDescriptionBulletFour),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletFourLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletFourLinkName,
      ),
    },
    bulletFive: {
      bullet: formatMessage(delimitation.labels.agreementDescriptionBulletFive),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletFiveLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletFiveLinkName,
      ),
    },
    bulletSix: {
      bullet: formatMessage(delimitation.labels.agreementDescriptionBulletSix),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletSixLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletSixLinkName,
      ),
    },
    bulletSeven: {
      bullet: formatMessage(
        delimitation.labels.agreementDescriptionBulletSeven,
      ),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletSevenLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletSevenLinkName,
      ),
    },
    bulletEight: {
      bullet: formatMessage(
        delimitation.labels.agreementDescriptionBulletEight,
      ),
      link: formatMessage(
        delimitation.labels.agreementDescriptionBulletEightLink,
      ),
      linkText: formatMessage(
        delimitation.labels.agreementDescriptionBulletEightLinkName,
      ),
    },
  }
}
