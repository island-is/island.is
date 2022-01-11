import { defineMessages } from 'react-intl'

export const studentForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.studentForm.general.sectionTitle',
      defaultMessage: 'Nám',
      description: 'Student form Page Title',
    },
    pageTitle: {
      id: 'fa.application:section.studentForm.general.pageTitle',
      defaultMessage: 'Ertu í lánshæfu námi?',
      description: 'Student form page title',
    },
  }),
  form: defineMessages({
    notStudent: {
      id: 'fa.application:section.studentForm.form.notStudent',
      defaultMessage: 'Nei',
      description: 'Student form radio selection when applicant is not student',
    },
    isStudent: {
      id: 'fa.application:section.studentForm.form.isStudent',
      defaultMessage: 'Já',
      description: 'Student form radio selection when applicant is a student',
    },
  }),
  input: defineMessages({
    label: {
      id: 'fa.application:section.studentForm.input.label',
      defaultMessage: 'Nám og skóli',
      description: 'Student form label for input when applicant is student',
    },
    placeholder: {
      id: 'fa.application:section.studentForm.input.placeholder',
      defaultMessage: 'Skrifaðu hér',
      description:
        'Student form placeholder for input when applicant is student',
    },
    example: {
      id: 'fa.application:section.studentForm.input.example',
      defaultMessage: 'Dæmi: Viðskiptafræði í HR',
      description: 'Student form label for input when applicant is student',
    },
  }),
}
