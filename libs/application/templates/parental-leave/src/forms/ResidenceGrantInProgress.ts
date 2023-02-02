import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { inReviewFormMessages } from '../lib/messages'
import { actionsResidenceGrant } from '../lib/parentalLeaveUtils'

export const ResidenceGrantInProgress: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residentGrantApplicationInProgress',
      title: 'Dvalarstyrkur',
      children: [
        buildSubmitField({
          id: 'residentGrantApplicationInProgress2',
          title: 'Dvalarstyrkur',
          refetchApplicationAfterSubmit: true,
          actions: actionsResidenceGrant('confirm', []),
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
