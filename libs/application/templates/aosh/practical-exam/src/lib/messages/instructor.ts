import { defineMessages } from 'react-intl'

export const instructor = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:instructor.general.pageTitle',
      defaultMessage: 'Leiðbeinendur',
      description: `instructor's page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:instructor.general.pageDescription',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: `instructor's page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:instructor.general.sectionTitle',
      defaultMessage: 'Leiðbeinendur',
      description: `instructor section title`,
    },
  }),
  tableRepeater: defineMessages({
    addInstructorButton: {
      id: 'aosh.pe.application:instructor.tableRepeater.addInstructorButton',
      defaultMessage: 'Skrá fleiri leiðbeinendur',
      description: `Text for the button to add another instructor`,
    },
    saveInstructorButton: {
      id: 'aosh.pe.application:instructor.tableRepeater.saveInstructorButton',
      defaultMessage: 'Vista',
      description: `Text for the button to save instructor`,
    },
    instructorValidityErrorTitle: {
      id: 'aosh.pe.application:instructor.tableRepeater.instructorValidityErrorTitle',
      defaultMessage:
        'Ekki var hægt að skrá leiðbeinandann á verklegt vinnuvélapróf.',
      description: 'Alert message title when there is a invalid instructor',
    },
    instructorsGraphQLErrorTitle: {
      id: 'aosh.pe.application:instructor.tableRepeater.instructorsGraphQLErrorTitle',
      defaultMessage: 'Villa kom upp að sækja upplýsingar leiðbeinanda',
      description:
        'Alert message title when graphql call to validate instructor fails',
    },
    instructorsGraphQLError: {
      id: 'aosh.pe.application:instructor.tableRepeater.instructorsGraphQLError',
      defaultMessage:
        'Vinasamlegast eyddu út nýjustu færslu og reyndu aftur síðar',
      description:
        'Alert message when graphql call to validate instructor fails',
    },
    instructorValidityError: {
      id: 'aosh.pe.application:instructor.tableRepeater.instructorValidityError#markdown',
      defaultMessage:
        '#### Athugið að ef villa kemur upp við skráningu leiðbeinanda þá geta nokkrar ástæður legið þar að baki. Meðal þess sem þarf að hafa í huga er:\n- Leiðbeinandi þarf að hafa kennsluréttindi á vélaflokkinn sem próftaki er skráður í.\n- Kennsluréttindin á vélaflokkinn mega ekki vera útrunnin hjá leiðbeinandanum.\n- Vinsamlegast farið yfir og tryggið að öll réttindi séu gild hjá leiðbeinandum og hafið svo samband við þjónustuver Vinnueftirlitsins ef það leysir ekki málið.',
      description: 'Alert message when there is a invalid instructor',
    },
    duplicateError: {
      id: 'aosh.pe.application:instructor.tableRepeater.duplicateError',
      defaultMessage: 'Endurtekning fundin',
      description:
        'Error message when there is a duplicate email, phone or national id',
    },
    removeAllButton: {
      id: 'aosh.pe.application:instructor.tableRepeater.removeAllButton',
      defaultMessage: 'Fjarlægja ógjaldgenga leiðbeinendur',
      description: 'Button label for removing all invalid instructors',
    },
  }),
}
