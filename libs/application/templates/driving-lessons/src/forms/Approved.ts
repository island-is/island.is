import {
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedDrivingLessonsApplication',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildIntroductionField({
      id: 'approved',
      name: 'Til hamingju!',
      introduction:
        'Umsókn þín um ökunám hefur verið samþykkt! Það er mikið gleðiefni. Ökukennarinn sem þú valdir mun hafa samband innan tveggja vikna til að ákveða framhaldið. ',
    }),
  ],
})
