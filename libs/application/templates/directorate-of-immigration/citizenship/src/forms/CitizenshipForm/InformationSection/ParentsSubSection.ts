import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const ParentsSubSection = buildSubSection({
  id: Routes.PARENTINFORMATION,
  title: information.labels.parents.subSectionTitle,
  // TODO REVERT WHEN FIXED WITH UTL
  // condition: (_, externalData) => {
  //   const residenceConditionInfo = getValueViaPath(
  //     externalData,
  //     'applicantInformation.data.residenceConditionInfo',
  //     {},
  //   ) as ApplicantInformation

  //   const hasResConMaritalStatus =
  //     residenceConditionInfo.cohabitationISCitizen5YearDomicile ||
  //     residenceConditionInfo.cohabitationISCitizen5YrsDomicileMissingDate ||
  //     residenceConditionInfo.marriedISCitizenDomicile4Years ||
  //     residenceConditionInfo.marriedISCitizenDomicile4YrsMissingDate

  //   const hasOtherValidResidenceConditions =
  //     residenceConditionInfo.domicileResidence7Years ||
  //     residenceConditionInfo.asylumSeekerOrHumanitarianResPerm5year ||
  //     residenceConditionInfo.noNationalityAnd5YearsDomicile ||
  //     residenceConditionInfo.nordicCitizenship4YearDomicile

  //   const eesResidenceCondition = residenceConditionInfo.eesResidenceCondition

  //   return (
  //     (!hasResConMaritalStatus && !hasOtherValidResidenceConditions) ||
  //     !eesResidenceCondition
  //   ) //only show this screen if cohabitation is not a reason for applying and no other conditions are met
  // },
  children: [
    buildMultiField({
      id: Routes.PARENTINFORMATION,
      title: information.labels.parents.pageTitle,
      children: [
        buildCustomField({
          id: 'parentInformation',
          description: '',
          component: 'Parents',
        }),
      ],
    }),
  ],
})
