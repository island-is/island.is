import { defineMessages } from 'react-intl'

export const academicBackground = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:academicBackground.general.sectionTitle',
      defaultMessage: 'Námsferlill',
      description: 'Academic background section title',
    },
    pageTitle: {
      id: 'aa.application:academicBackground.general.pageTitle',
      defaultMessage: 'Námsferlill',
      description: `Academic background page title`,
    },
    description: {
      id: 'aa.application:academicBackground.general.description',
      defaultMessage:
        'Hérna getur verið gott að skrifa inn það nám sem þú hefur farið í gegnum. Þú mátt setja eins mörg nám og þú vilt.',
      description: `Academic background description`,
    },
  }),
  labels: defineMessages({
    addEducationButton: {
      id: 'aa.application:academicBackground.labels.addEducationButton',
      defaultMessage: 'Bæta við námi',
      description: 'Add education button label',
    },
    school: {
      id: 'aa.application:academicBackground.labels.school',
      defaultMessage: 'Skóli',
      description: 'School label',
    },
    subject: {
      id: 'aa.application:academicBackground.labels.subject',
      defaultMessage: 'Námsgrein',
      description: 'Subject label',
    },
    levelOfStudy: {
      id: 'aa.application:academicBackground.labels.levelOfStudy',
      defaultMessage: 'Námsstig',
      description: 'Level of study label',
    },
    degree: {
      id: 'aa.application:academicBackground.labels.degree',
      defaultMessage: 'Prófgráða',
      description: 'Degree label',
    },
    endOfStudies: {
      id: 'aa.application:academicBackground.labels.endOfStudies',
      defaultMessage: 'Námslok',
      description: 'End of studies label',
    },
    endOfStudiesPlaceholder: {
      id: 'aa.application:academicBackground.labels.endOfStudiesPlaceholder',
      defaultMessage: 'Námi ólokið',
      description: 'End of studies placeholder label',
    },
    education: {
      id: 'aa.application:academicBackground.labels.education',
      defaultMessage: 'Nám',
      description: 'curriculum',
    },
    currentlyStudying: {
      id: 'aa.application:academicBackground.labels.currentlyStudying',
      defaultMessage: 'Er í þessu námi',
      description: 'Is currently studying',
    },
  }),
}
