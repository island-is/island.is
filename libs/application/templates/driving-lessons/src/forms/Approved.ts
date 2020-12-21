import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedDrivingLessonsApplication',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      name: 'Til hamingju!',
      description:
        'Umsókn þín um ökunám hefur verið samþykkt! Það er mikið gleðiefni. Ökukennarinn sem þú valdir mun hafa samband innan tveggja vikna til að ákveða framhaldið. ',
    }),
  ],
})
