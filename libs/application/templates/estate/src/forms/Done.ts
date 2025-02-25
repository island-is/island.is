import {
  buildForm,
  buildMultiField,
  getValueViaPath,
  buildMessageWithLinkButtonField,
  coreMessages,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { EstateTypes } from '../lib/constants'
import Grieving from '../components/assets/Grieving'

export const done: Form = buildForm({
  id: 'divisionOfEstateDone',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.doneTitle,
      description: (application) => {
        const selectedEstate = getValueViaPath<string>(
          application.answers,
          'selectedEstate',
        )
        return selectedEstate === EstateTypes.officialDivision
          ? m.divisionOfEstateDoneSubtitle
          : selectedEstate === EstateTypes.estateWithoutAssets
          ? m.estateWithoutAssetsSubtitle
          : selectedEstate === EstateTypes.permitForUndividedEstate
          ? m.permitToPostponeEstateDivisionSubtitle
          : m.divisionOfEstateByHeirsSubtitle
      },
      children: [
        buildImageField({
          id: 'doneImage',
          image: Grieving,
          marginBottom: 3,
          imageWidth: 'auto',
          imagePosition: 'center',
        }),
        buildMessageWithLinkButtonField({
          id: 'goToServicePortal',
          url: '/minarsidur/umsoknir',
          buttonTitle: m.openServicePortalTitle,
          message: m.openServicePortalMessage,
        }),
      ],
    }),
  ],
})
