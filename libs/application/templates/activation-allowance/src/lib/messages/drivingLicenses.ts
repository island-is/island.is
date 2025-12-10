import { defineMessages } from 'react-intl'

export const drivingLicenses = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:drivingLicenses.general.sectionTitle',
      defaultMessage: 'Ökuréttindi',
      description: 'Driving licenses section title',
    },
    pageTitle: {
      id: 'aa.application:drivingLicenses.general.pageTitle',
      defaultMessage: 'Ökuréttindi',
      description: `Driving licenses title`,
    },
    description: {
      id: 'aa.application:drivingLicenses.general.description',
      defaultMessage: 'Vinsamlegast skráðu réttindi ef einhver eru.',
      description: `Driving licenses description`,
    },
  }),
  labels: defineMessages({
    drivingLicenseType: {
      id: 'aa.application:drivingLicenses.labels.drivingLicenseType',
      defaultMessage: 'Tegund ökuréttinda',
      description: 'Driving license type label',
    },
    hasDrivingLicenseLabel: {
      id: 'aa.application:drivingLicenses.labels.hasDrivingLicenseLabel',
      defaultMessage: 'Ég er með ökuréttindi',
      description: 'Driving license checkbox label',
    },
    workMachineRights: {
      id: 'aa.application:drivingLicenses.labels.workMachineRights',
      defaultMessage: 'Vinnuvélaréttindi',
      description: 'Work machine rights  label',
    },
    hasHeavyMachineryLicenseLabel: {
      id: 'aa.application:drivingLicenses.labels.hasHeavyMachineryLicenseLabel',
      defaultMessage: 'Ég er með vinnuvélaréttindi',
      description: 'Work machine checkbox label',
    },
  }),
}
