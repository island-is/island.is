import { defineMessages } from 'react-intl'

export const fishingLicenseFurtherInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.sectionTitle',
      defaultMessage: 'Umsókn um veiðileyfi',
      description: 'Fishing license further information section title',
    },
    title: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.name',
      defaultMessage: 'Umsókn um veiðileyfi',
      description: 'Fishing license further information title',
    },
    applicationPrefix: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.applicationPrefix',
      defaultMessage: 'Sótt er um',
      description: 'Applying for',
    },
    applicationPostfix: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.applicationPostfix',
      defaultMessage: 'fyrir eftirfarandi skip',
      description: 'for the following ship',
    }
  }),
  labels: defineMessages({
    date: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.date',
      defaultMessage: 'Umbeðin gildistaka',
      description: 'Date of validity',
    },
    date1: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.date',
      defaultMessage: 'Umbeðin gildistaka NR 1',
      description: 'Date of validity',
    },
    date2: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.date',
      defaultMessage: 'Umbeðin gildistaka NR 2',
      description: 'Date of validity',
    },
  }),
  placeholders: defineMessages({
    date: {
      id: 'gfl.application:fishingLicenseFurtherInformation.placeholders.date',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Choose a date',
    },
  }),
}
