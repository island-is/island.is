import {
  buildForm,
  buildMultiField,
  getValueViaPath,
  buildMessageWithLinkButtonField,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { EstateTypes } from '../lib/constants'
import Grieving from '../../assets/Grieving'

export const done: Form = buildForm({
  id: 'divisionOfEstateDone',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: (application) => {
        const selectedEstate = getValueViaPath(
          application.answers,
          'selectedEstate',
        )
        return selectedEstate === EstateTypes.officialDivision
          ? m.officialDivisionDoneTitle
          : selectedEstate === EstateTypes.estateWithoutAssets
          ? m.estateWithoutAssetsDoneTitle
          : selectedEstate === EstateTypes.permitForUndividedEstate
          ? m.undividedEstateDoneTitle
          : selectedEstate === EstateTypes.divisionOfEstateByHeirs
          ? m.privateDivisionDoneTitle
          : m.doneTitle
      },
      description: (application) => {
        const selectedEstate = getValueViaPath(
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
          marginTop: 3,
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
