import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Application, NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  formatGender,
  getApplicationAnswers,
  getApplicationExternalData,
  getGenderOptions,
  getSelectedChild,
  getPronouns,
} from '../../../lib/newPrimarySchoolUtils'

export const childInfoSubSection = buildSubSection({
  id: 'childInfoSubSection',
  title: newPrimarySchoolMessages.childrenNParents.childInfoSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childInfo',
      title: newPrimarySchoolMessages.childrenNParents.childInfoTitle,
      description:
        newPrimarySchoolMessages.childrenNParents.childInfoDescription,
      children: [
        buildTextField({
          id: 'childInfo.name',
          title: newPrimarySchoolMessages.shared.fullName,
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application)?.fullName,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application)?.nationalId,
        }),
        buildTextField({
          id: 'childInfo.address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          disabled: true,
          // TODO: Nota gögn frá Júní
          // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'childInfo.address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          disabled: true,
          // TODO: Nota gögn frá Júní
          // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'childInfo.address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          disabled: true,
          // TODO: Nota gögn frá Júní
          // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),
        buildSelectField({
          id: 'childInfo.pronoun',
          title: newPrimarySchoolMessages.childrenNParents.pronoun,
          placeholder:
            newPrimarySchoolMessages.childrenNParents.pronounPlaceholder,
          width: 'half',
          options: getPronouns,
        }),
        buildSelectField({
          id: 'childInfo.gender',
          title: newPrimarySchoolMessages.childrenNParents.childInfoGender,
          placeholder:
            newPrimarySchoolMessages.childrenNParents
              .childInfoGenderPlaceholder,
          width: 'half',
          // TODO: Nota gögn fá Júní
          options: getGenderOptions(),
          defaultValue: (application: Application) =>
            formatGender(getSelectedChild(application)?.genderCode),
        }),
        buildRadioField({
          id: 'childInfo.differentPlaceOfResidence',
          title:
            newPrimarySchoolMessages.childrenNParents.differentPlaceOfResidence,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.streetAddress',
          title:
            newPrimarySchoolMessages.childrenNParents.childInfoPlaceOfResidence,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { differentPlaceOfResidence } = getApplicationAnswers(answers)

            return differentPlaceOfResidence === YES
          },
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          format: '###',
          required: true,
          condition: (answers) => {
            const { differentPlaceOfResidence } = getApplicationAnswers(answers)

            return differentPlaceOfResidence === YES
          },
        }),
      ],
    }),
  ],
})
