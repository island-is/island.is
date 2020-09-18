import { buildForm } from '../../../lib/formBuilders'
import { buildIntroductionField } from '../../../lib/fieldBuilders'
import { Form } from '../../../types/Form'
import { ApplicationTypes } from '../../../types/ApplicationTypes'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.DRIVING_LESSONS,
  ownerId: 'TODO?',
  name: 'Í vinnslu',
  mode: 'pending',
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction: 'Umsókn þín um ökunám er nú í vinnslu. ',
    }),
  ],
})
