import { buildForm } from '../../../lib/formBuilders'
import { buildIntroductionField } from '../../../lib/fieldBuilders'
import { Form } from '../../../types/Form'
import { ApplicationTypes } from '../../../types/ApplicationTypes'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.DRIVING_LESSONS,
  ownerId: 'TODO?',
  name: 'Hafnað',
  mode: 'rejected',
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: 'Því miður...',
      introduction:
        'Umsókn þinni um ökunám hefur verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
