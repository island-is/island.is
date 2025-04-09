import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'applicant section page title',
    },
  }),
  labels: defineMessages({}),
  personalInformation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.personalInformation.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'applicant personal information section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.personalInformation.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal information page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:applicant.personalInformation.pageDescription',
      defaultMessage: 'Vinsamlegast leiðréttið eftirfarandi ef þörf er á',
      description: 'Personal information page description',
    },
  }),
  informationChangeAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.sectionTitle',
      defaultMessage: 'Breytingar á högum',
      description: 'applicant information agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.pageTitle',
      defaultMessage: 'Breytingar á högum',
      description: 'information agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.pageDescription#markdown',
      defaultMessage:
        'Það er mjög mikilvægt að láta vita af öllum breytingum á þínum högum. Þar undir fellur:',
      description: 'information agreement page description',
    },
  }),
  familyInformation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.familyInformation.sectionTitle',
      defaultMessage: 'Fjölskylduupplýsingar',
      description: 'applicant family information section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.familyInformation.pageTitle',
      defaultMessage: 'Fjölskylduupplýsingar',
      description: 'family information page description',
    },
  }),
}
