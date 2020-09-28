import { buildForm } from '../../../lib/formBuilders'
import { buildIntroductionField } from '../../../lib/fieldBuilders'
import { Form } from '../../../types/Form'
import { ApplicationTypes } from '../../../types/ApplicationTypes'

export const Approved: Form = buildForm({
  id: ApplicationTypes.DRIVING_LESSONS,
  ownerId: 'TODO?',
  name: 'Samþykkt',
  mode: 'approved',
  children: [
    buildIntroductionField({
      id: 'approved',
      name: 'Til hamingju!',
      introduction:
        'Umsókn þín um ökunám hefur verið samþykkt! Það er mikið gleðiefni. Ökukennarinn sem þú valdir mun hafa samband innan tveggja vikna til að ákveða framhaldið. ',
    }),
  ],
})
