import { defineMessages } from 'react-intl'

export const income = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:income.general.sectionTitle',
      defaultMessage: 'Tekjur',
      description: 'Income section title',
    },
    pageTitle: {
      id: 'aa.application:income.general.pageTitle',
      defaultMessage: 'Tekjur',
      description: `Income page title`,
    },
  }),
  labels: defineMessages({
    incomeMonth: {
      id: 'aa.application:income.labels.incomeMonth',
      defaultMessage: 'Launamánuður',
      description: 'Income month label',
    },
    salaryIncome: {
      id: 'aa.application:income.labels.salaryIncome',
      defaultMessage: 'Launatekjur',
      description: 'Salary income label',
    },
    employer: {
      id: 'aa.application:income.labels.employer',
      defaultMessage: 'Launagreiðandi',
      description: 'Employer label',
    },
    hasEmploymentEnded: {
      id: 'aa.application:income.labels.hasEmploymentEnded',
      defaultMessage: 'Hefur þú lokið störfum?',
      description:
        'Description for yes/no question wether employment has ended',
    },
    endOfEmployment: {
      id: 'aa.application:income.labels.endOfEmployment',
      defaultMessage: 'Hvenær laukst/lýkur þú störfum?',
      description: 'When do you/did you end employment label',
    },
    endOfEmploymentDate: {
      id: 'aa.application:income.labels.endOfEmploymentDate',
      defaultMessage: 'Starfslok',
      description: 'End of employment date label',
    },
    incomeFromOtherThanJob: {
      id: 'aa.application:income.labels.incomeFromOtherThanJob',
      defaultMessage: 'Tekjurnar eru ekki vegna starfs',
      description: 'Income from other than job label',
    },
    explanationDescription: {
      id: 'aa.application:income.labels.explanationDescription',
      defaultMessage:
        'Vinsamlegast gefðu upp nánari skýringu á þessum greiðslum',
      description: 'Explanation description',
    },
    explanation: {
      id: 'aa.application:income.labels.explanation',
      defaultMessage: 'Skýring greiðslu',
      description: 'Income explanation',
    },
    explanationPlaceholder: {
      id: 'aa.application:income.labels.explanationPlaceholder',
      defaultMessage: 'Styrkir, uppgjör launagreiðanda...',
      description: 'Income explanation placeholder',
    },
    leaveDescription: {
      id: 'aa.application:income.labels.leaveDescription',
      defaultMessage: 'Áttirðu ótekið orlof þegar þú hættir í starfi?',
      description: 'Had remaining leave days description label',
    },
    numberAndUsageOfLeaveDescription: {
      id: 'aa.application:income.labels.numberAndUsageOfLeaveDescription',
      defaultMessage:
        'Vinsamlegast tilgreindu fjölda orlofsdaga og hvenær þú ætlar að nýta þá',
      description: 'If user has leave days left, label for that',
    },
    numberOfLeaveDays: {
      id: 'aa.application:income.labels.numberOfLeaveDays',
      defaultMessage: 'Fjöldi orlofsdaga',
      description: 'Number of leave days left label',
    },
    dateFrom: {
      id: 'aa.application:income.labels.dateFrom',
      defaultMessage: 'Dagsetning frá',
      description: 'Date from label',
    },
    dateTo: {
      id: 'aa.application:income.labels.dateTo',
      defaultMessage: 'Dagsetning til',
      description: 'Date to label',
    },
    pickDatePlaceHolder: {
      id: 'aa.application:income.labels.pickDatePlaceHolder',
      defaultMessage: 'Veldur dagsetningu',
      description: 'Pick a date placeholder label',
    },
    addLine: {
      id: 'aa.application:income.labels.addLine',
      defaultMessage: 'Bæta við línu',
      description: 'Add line button label',
    },
  }),
}
