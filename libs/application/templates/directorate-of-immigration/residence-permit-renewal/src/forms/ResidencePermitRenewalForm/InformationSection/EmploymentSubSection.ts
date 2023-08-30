import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const EmploymentSubSection = (index: number) =>
  buildSubSection({
    id: 'employment',
    title: information.labels.employment.subSectionTitle,
    condition: (_, externalData) => {
      const isForApplicant = index === 0

      const isPermitTypeEmployment = getValueViaPath(
        externalData,
        'applicantCurrentResidencePermitType.data.isPermitTypeEmployment',
        false,
      ) as boolean

      const isWorkPermitTypeSpecial = getValueViaPath(
        externalData,
        'applicantCurrentResidencePermitType.data.isWorkPermitTypeSpecial',
        false,
      ) as boolean

      return true
      // TODO: SET RIGHT CONDITION
      // (
      //   isForApplicant && (isPermitTypeEmployment || isWorkPermitTypeSpecial)
      // )
    },
    children: [
      buildMultiField({
        id: 'employmentMultiField',
        title: information.labels.employment.pageTitle,
        description: information.labels.employment.description,
        children: [
          buildDescriptionField({
            id: 'employment.title',
            title: information.labels.employment.title,
            titleVariant: 'h5',
          }),

          buildDescriptionField({
            id: 'employment.title',
            title:
              '1. Atvinnuleyfi til sérhæfðra starfsmanna á grundvelli þjónustusamnings',
            condition: (_, externalData) => {
              const isWorkPermitTypeEmploymentServiceAgreement =
                getValueViaPath(
                  externalData,
                  'applicantCurrentResidencePermitType.data.isWorkPermitTypeEmploymentServiceAgreement',
                  false,
                ) as boolean

              return isWorkPermitTypeEmploymentServiceAgreement
            },
          }),
          buildDescriptionField({
            id: 'employment.title',
            title:
              '1. Atvinnuleyfi v/ sérfræðiþekkingar / Atvinnuleyfi f. íþróttafólk / Atvinnuleyfi v/ skorts á starfsfólki / Atvinnuleyfi til sérhæfðra starfsmanna..',
            condition: (_, externalData) => {
              const isWorkPermitTypeEmploymentOther = getValueViaPath(
                externalData,
                'applicantCurrentResidencePermitType.data.isWorkPermitTypeEmploymentOther',
                false,
              ) as boolean

              return isWorkPermitTypeEmploymentOther
            },
          }),
          buildDescriptionField({
            id: 'employment.title',
            title:
              '2. Atvinnuleyfi v/ náms / Atvinnuleyfi v/ sérstakra aðstæðna (mansal,...) / Atvinnuleyfi v/ fjölskyldusameiningar (alþjóðleg vernd, aðstandandi doktorsnema,...)',
            condition: (_, externalData) => {
              const isWorkPermitTypeSpecial = getValueViaPath(
                externalData,
                'applicantCurrentResidencePermitType.data.isWorkPermitTypeSpecial',
                false,
              ) as boolean

              return isWorkPermitTypeSpecial
            },
          }),
        ],
      }),
    ],
  })
