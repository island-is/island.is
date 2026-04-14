import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import {
  nationalIdPreface,
  getNationalIdPrefix,
} from '../../../utils/assigneeUtils'
import { doesAssigneeAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'

export const assetDeclerationSection = buildSection({
  condition: (answers, externalData, user) =>
    doesAssigneeAddressMatchRentalContract(answers, externalData, user),
  id: 'assetDeclerationSection',
  title: 'Eignayfirlýsing',
  children: [
    buildMultiField({
      id: 'assetDeclerationMultiField',
      title: 'Eignayfirlýsing',
      children: [
        buildDescriptionField({
          id: 'assetDeclerationDescription',
          description:
            'Skattframtali fyrir síðasta ár hefur ekki verið skilað. Til að halda áfram þarf að fylla út eignayfirlýsingu.',
        }),
        buildDescriptionField({
          id: 'assetDeclerationDescription2',
          description:
            'Eignayfirlýsing er einfaldlega upplistun á öllum þínum eignum. Ef þú átt engar eignir, þá þarft þú að lýsa því yfir að þú átt engar eignir.',
          marginBottom: 4,
        }),
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assetDeclerationRadio'),
          title: 'Átt þú einhverskonar eignir?',
          description:
            'Eignir geta til dæmis verið: Fasteignir, ökutæki, hlutabréf eða fjármagn',
          options: [
            { label: 'Já', value: YES },
            { label: 'Nei', value: NO },
          ],
          marginBottom: 4,
        }),
        buildTextField({
          condition: (_answers, _externalData, user) => {
            if (!user) return false
            const prefix = getNationalIdPrefix(user)
            return (
              getValueViaPath(_answers, `${prefix}.assetDeclerationRadio`) ===
              YES
            )
          },
          id: (application, user) =>
            nationalIdPreface(application, user, 'assetDeclerationTextField'),
          description: 'Vinsamlegast listaðu upp allar þínar eignir.',
          variant: 'textarea',
          rows: 10,
        }),
      ],
    }),
  ],
})
