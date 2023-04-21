import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjendur',
      description: 'Applicant section title',
    },
  }),
  labels: {
    pickApplicant: defineMessages({
      subSectionTitle: {
        id:
          'doi.rpr.application:applicant.labels.pickApplicant.subSectionTitle',
        defaultMessage: 'Fyrir hvern á að sækja um?',
        description: 'Pick applicant sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.pageTitle',
        defaultMessage: 'Umsækjendur',
        description: 'Pick applicant page title',
      },
      description: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.description',
        defaultMessage:
          'Interdum et malesuada fames ac ante ipsum primis in faucibus.',
        description: 'Pick applicant description',
      },
      title: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.title',
        defaultMessage: 'Fyrir hvern á að sækja um?',
        description: 'Pick applicant sub section title',
      },
    }),
    permanent: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:applicant.labels.permanent.subSectionTitle',
        defaultMessage: 'Réttindi - ótímabundið',
        description: 'Permanent sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:applicant.labels.permanent.pageTitle',
        defaultMessage: 'Réttindi - ótímabundið dvalarleyfi',
        description: 'Permanent page title',
      },
      description: {
        id: 'doi.rpr.application:applicant.labels.permanent.description',
        defaultMessage:
          'Sed volutpat, metus eu rutrum gravida, odio ante semper arcu, at volutpat lectus ex et lectus.',
        description: 'Permanent description',
      },
      title: {
        id: 'doi.rpr.application:applicant.labels.permanent.title',
        defaultMessage: 'Test',
        description: 'Permanent sub section title',
      },
    }),
  },
}
