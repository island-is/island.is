import {
  buildForm,
  buildImageField,
  getValueViaPath,
} from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'
import { MovingSearching } from '@island.is/application/assets/graphics'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: HmsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: m.conclusionMessages.title,
      alertTitle: m.conclusionMessages.alertTitle,
      alertMessage: (application) => {
        const terminationType = getValueViaPath<{ answer: string }>(
          application.answers,
          'terminationType',
        )
        return {
          ...(terminationType?.answer === 'cancelation'
            ? m.conclusionMessages.alertMessageCancelation
            : m.conclusionMessages.alertMessageTermination),
        }
      },
      multiFieldTitle: m.conclusionMessages.multiFieldTitle,
      accordion: false,
      descriptionFieldDescription:
        m.conclusionMessages.descriptionFieldDescription,
      image: buildImageField({
        marginTop: 4,
        marginBottom: 4,
        id: 'tree',
        image: MovingSearching,
        imagePosition: 'center',
      }),
    }),
  ],
})
