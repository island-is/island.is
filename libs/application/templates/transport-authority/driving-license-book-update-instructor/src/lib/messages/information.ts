import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'dlbui.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'dlbui.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
  }),
  labels: {
    instructor: defineMessages({
      title: {
        id: 'dlbui.application:information.labels.instructor.title',
        defaultMessage: 'Ökukennari',
        description: 'Instructor title',
      },
    }),
    oldInstructor: defineMessages({
      subtitle: {
        id: 'dlbui.application:information.labels.oldInstructor.subtitle',
        defaultMessage: 'Núverandi ökukennari',
        description: 'Old instructor sub title',
      },
      nationalId: {
        id: 'dlbui.application:information.labels.oldInstructor.nationalId',
        defaultMessage: 'Kennitala',
        description: 'Old instructor national ID label',
      },
      name: {
        id: 'dlbui.application:information.labels.oldInstructor.name',
        defaultMessage: 'Nafn',
        description: 'Old instructor name label',
      },
    }),
    newInstructor: defineMessages({
      subtitle: {
        id: 'dlbui.application:information.labels.newInstructor.subtitle',
        defaultMessage: 'Veldu nýjan ökukennara',
        description: 'Select new instructor sub title',
      },
      selectSubLabel: {
        id: 'dlbui.application:information.labels.newInstructor.selectSubLabel',
        defaultMessage: 'Nýr ökukennari',
        description: 'Select new instructor select sub label',
      },
    }),
  },
  confirmation: defineMessages({
    confirm: {
      id: 'dlbui.application:information.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
