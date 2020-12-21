import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: 'DrivingLessonsRejected',
  title: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      title: 'Því miður...',
      description:
        'Umsókn þinni um ökunám hefur verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
