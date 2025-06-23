import { resume } from 'pdfkit'
import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'overview section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit',
      description: 'overview section page title',
    },
    pageDescription: {
      id: 'vmst.ub.application:overview.general.pageDescription',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'overview section page description',
    },
    firstSectionTitle: {
      id: 'vmst.ub.application:overview.general.firstSectionTitle',
      defaultMessage: 'Fyrri hluti: Þinn bótaréttur',
      description: 'overview section first section title',
    },
    secondSectionTitle: {
      id: 'vmst.ub.application:overview.general.secondSectionTitle',
      defaultMessage: 'Seinni hluti: Atvinnuleitin',
      description: 'overview section second section title',
    },
  }),
  labels: {
    applicantOverview: defineMessages({
      applicant: {
        id: 'vmst.ub.application:overview.labels.applicantOverview.applicant',
        defaultMessage: 'Umsækjandi',
        description: 'overview section applicant overview applicant label',
      },
      children: {
        id: 'vmst.ub.application:overview.labels.applicantOverview.children',
        defaultMessage: 'Börn á framfæri',
        description: 'overview section applicant overview children label',
      },
    }),

    employmentInformation: defineMessages({
      information: {
        id: 'vmst.ub.application:overview.labels.employmentInformation.information',
        defaultMessage: 'Atvinnuupplýsingar',
        description: 'overview section employmentInformation information label',
      },
      history: {
        id: 'vmst.ub.application:overview.labels.employmentInformation.history',
        defaultMessage: 'Atvinnusaga',
        description: 'overview section employmentInformation history label',
      },
    }),

    education: defineMessages({
      education: {
        id: 'vmst.ub.application:overview.labels.education.education',
        defaultMessage: 'Menntun',
        description: 'overview section education label',
      },
    }),

    payout: defineMessages({
      paymentInformation: {
        id: 'vmst.ub.application:overview.labels.payout.paymentInformation',
        defaultMessage: 'Greiðsluupplýsingar',
        description: 'overview section paymentInformation label',
      },
      personalDiscount: {
        id: 'vmst.ub.application:overview.labels.payout.personalDiscount',
        defaultMessage: 'Persónuafsláttur',
        description: 'overview section payout personal discount label',
      },
      vacation: {
        id: 'vmst.ub.application:overview.labels.payout.vacation',
        defaultMessage: 'Orlof',
        description: 'overview section payout vacation label',
      },
      otherPayouts: {
        id: 'vmst.ub.application:overview.labels.payout.otherPayouts',
        defaultMessage: 'Aðrar greiðslur',
        description: 'overview section payout other payouts label',
      },
    }),

    employmentSearch: defineMessages({
      employmentWishes: {
        id: 'vmst.ub.application:overview.labels.employmentSearch.employmentWishes',
        defaultMessage: 'Óskir um störf',
        description:
          'overview section employmentSearch employment wishes label',
      },
      otherRegions: {
        id: 'vmst.ub.application:overview.labels.employmentSearch.otherRegions',
        defaultMessage: 'Önnur svæði',
        description: 'overview section employmentSearch other regions label',
      },
    }),

    educationHistory: defineMessages({
      educationHistory: {
        id: 'vmst.ub.application:overview.labels.educationHistory.educationHistory#markdown',
        defaultMessage: 'Námsferill {index}',
        description: 'overview section education history label',
      },
    }),

    license: defineMessages({
      drivingLicense: {
        id: 'vmst.ub.application:overview.labels.license.drivingLicense',
        defaultMessage: 'Ökuréttindi',
        description: 'overview section drivingLicense label',
      },
      workMachineLicense: {
        id: 'vmst.ub.application:overview.labels.license.workMachineLicense',
        defaultMessage: 'Vinnuvélaleyfi',
        description: 'overview section workMachineLicense label',
      },
    }),

    languages: defineMessages({
      languages: {
        id: 'vmst.ub.application:overview.labels.languages.languages',
        defaultMessage: 'Tungumálfærni',
        description: 'overview section languages label',
      },
    }),

    eures: defineMessages({
      eures: {
        id: 'vmst.ub.application:overview.labels.eures.eures',
        defaultMessage: 'Skráning á EURES svæðinu',
        description: 'overview section eures label',
      },
    }),

    resume: defineMessages({
      resume: {
        id: 'vmst.ub.application:overview.labels.resume.resume',
        defaultMessage: 'Ferilskrá',
        description: 'overview section resume label',
      },
    }),
  },
}
