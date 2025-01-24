import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getNeighborhoodSchoolName } from '../../../lib/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,

  children: [
    buildMultiField({
      id: 'neighbourhoodSchoolSelection',
      title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
      description: newPrimarySchoolMessages.primarySchool.schoolDescription,
      children: [
        buildRadioField({
          id: 'school.applyForNeighbourhoodSchool',
          title: '',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolLabel,
                subLabel: {
                  ...newPrimarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolSubLabel,
                  values: {
                    neighborhoodSchoolName:
                      getNeighborhoodSchoolName(application),
                  },
                },

                value: YES,
              },
              {
                label:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForOtherSchoolLabel,
                subLabel:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForOtherSchoolSubLabel,
                value: NO,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
