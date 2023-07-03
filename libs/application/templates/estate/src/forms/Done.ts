import {
  buildForm,
  buildCustomField,
  buildMultiField,
  getValueViaPath,
  buildMessageWithLinkButtonField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { EstateTypes } from '../lib/constants'

export const done: Form = buildForm({
  id: 'divisionOfEstateDone',
  title: '',
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
        buildCustomField({
          id: 'doneImage',
          component: 'DoneImage',
          title: '',
        }),
        buildMessageWithLinkButtonField({
          id: 'goToServicePortal',
          title: '',
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
        }),
      ],
    }),
  ],
})
