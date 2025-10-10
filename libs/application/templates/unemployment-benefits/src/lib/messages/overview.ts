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
      differentResidence: {
        id: 'vmst.ub.application:overview.labels.applicantOverview.differentResidence',
        defaultMessage: 'Dvalarstaður',
        description:
          'overview section applicant overview different residence label',
      },
      children: {
        id: 'vmst.ub.application:overview.labels.applicantOverview.children',
        defaultMessage: 'Börn á framfæri',
        description: 'overview section applicant overview children label',
      },
      password: {
        id: 'vmst.ub.application:overview.labels.applicantOverview.password',
        defaultMessage: 'Lykilorð',
        description: 'overview section applicant overview password label',
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
      notLastTvelveMonths: {
        id: 'vmst.ub.application:overview.labels.education.notLastTvelveMonths',
        defaultMessage: 'Ekki verið í námi síðustu tólf mánuði',
        description: 'overview section education not last twelve months label',
      },
      currentEducation: {
        id: 'vmst.ub.application:overview.labels.education.currentEducation',
        defaultMessage: 'Upplýsingar um námið',
        description: 'overview section current education label',
      },
      endDate: {
        id: 'vmst.ub.application:overview.labels.education.endDate',
        defaultMessage: 'Námslok',
        description: 'overview section current education end date label',
      },
      predictedEndDate: {
        id: 'vmst.ub.application:overview.labels.education.predictedEndDate',
        defaultMessage: 'Áætluð námslok',
        description:
          'overview section current education predicted end date label',
      },
    }),

    payout: defineMessages({
      paymentInformation: {
        id: 'vmst.ub.application:overview.labels.payout.paymentInformation',
        defaultMessage: 'Greiðsluupplýsingar',
        description: 'overview section paymentInformation label',
      },
      taxDiscount: {
        id: 'vmst.ub.application:overview.labels.payout.taxDiscount',
        defaultMessage: 'Persónuafsláttur',
        description: 'overview section payout tax discount label',
      },
      vacation: {
        id: 'vmst.ub.application:overview.labels.payout.vacation',
        defaultMessage: 'Orlof',
        description: 'overview section payout vacation label',
      },
      hadNoVacation: {
        id: 'vmst.ub.application:overview.labels.payout.hadNoVacation',
        defaultMessage: 'Átti ekki ótekið orlof',
        description: 'overview section payout had no vacation label',
      },
      vacationDays: {
        id: 'vmst.ub.application:overview.labels.payout.vacationDays',
        defaultMessage: 'Fjöldi daga',
        description: 'overview section payout vacation days label',
      },
      vacationDaysFrom: {
        id: 'vmst.ub.application:overview.labels.payout.vacationDaysFrom',
        defaultMessage: 'Frá',
        description: 'overview section payout vacation days from label',
      },
      otherPayouts: {
        id: 'vmst.ub.application:overview.labels.payout.otherPayouts',
        defaultMessage: 'Aðrar greiðslur',
        description: 'overview section payout other payouts label',
      },
      otherPayoutsTR: {
        id: 'vmst.ub.application:overview.labels.payout.otherPayoutsTR',
        defaultMessage: 'Greiðslur frá TR',
        description: 'overview section payout other payouts TR label',
      },
      otherPayoutSicknessAllowance: {
        id: 'vmst.ub.application:overview.labels.payout.otherPayoutSicknessAllowance',
        defaultMessage: 'Sjúkradagpeningar',
        description:
          'overview section payout other payouts sickness allowance label',
      },
      paymentPerMonth: {
        id: 'vmst.ub.application:overview.labels.payout.paymentPerMonth',
        defaultMessage: 'á mánuði',
        description: 'overview section payout payment per month label',
      },
      capitalIncome: {
        id: 'vmst.ub.application:overview.labels.payout.capitalIncome',
        defaultMessage: 'Fjármagnstekjur',
        description: 'overview section payout capital income label',
      },
      bank: {
        id: 'vmst.ub.application:overview.labels.payout.bank',
        defaultMessage: 'Banki',
        description: 'overview section payout bank label',
      },
      pensionFund: {
        id: 'vmst.ub.application:overview.labels.payout.pensionFund',
        defaultMessage: 'Lífeyrissjóður',
        description: 'overview section payout pension fund label',
      },
      union: {
        id: 'vmst.ub.application:overview.labels.payout.union',
        defaultMessage: 'Stéttarfélag',
        description: 'overview section payout union label',
      },
      privatePensionFund: {
        id: 'vmst.ub.application:overview.labels.payout.privatePensionFund',
        defaultMessage: 'Viðbótasparnaður',
        description: 'overview section payout private pension fund label',
      },
      taxUsage: {
        id: 'vmst.ub.application:overview.labels.payout.taxUsage',
        defaultMessage: 'Nýting',
        description: 'overview section payout tax usage label',
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
        id: 'vmst.ub.application:overview.labels.educationHistory.educationHistory',
        defaultMessage: 'Námsferill',
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
