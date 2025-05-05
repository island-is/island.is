import {
  buildMultiField,
  buildSubSection,
  NO,
  buildRadioField,
  YES,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const FormerIcelanderSubSection = buildSubSection({
  id: 'formerIcelander',
  title: information.labels.formerIcelander.subSectionTitle,
  // TODO REVERT WHEN FIXED WITH UTL
  // condition: (formValue: FormValue, externalData) => {
  //   const residenceConditionInfo = getValueViaPath(
  //     externalData,
  //     'applicantInformation.data.residenceConditionInfo',
  //     {},
  //   ) as ApplicantInformation

  //   const parentAnswer = getValueViaPath(
  //     formValue,
  //     'parentInformation.parents',
  //     [],
  //   ) as Array<ParentsToApplicant>

  //   const totalParentsInAnswer = parentAnswer.filter(
  //     (x) => x.wasRemoved === 'false',
  //   )
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

  //   return (
  //     !hasResConMaritalStatus &&
  //     !hasOtherValidResidenceConditions &&
  //     totalParentsInAnswer.length === 0
  //   )
  // },
  children: [
    buildMultiField({
      id: 'formerIcelanderMultiField',
      title: information.labels.formerIcelander.pageTitle,
      description: information.labels.formerIcelander.description,
      children: [
        buildRadioField({
          id: 'formerIcelander',
          description: '',
          required: true,
          width: 'half',
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            { value: NO, label: information.labels.radioButtons.radioOptionNo },
          ],
        }),
        // TODO REVERT WHEN UTL FIXES SERVICES
        // buildAlertMessageField({
        //   id: 'formerIcelanderAlert',
        //   title: information.labels.formerIcelander.alertTitle,
        //   alertType: 'error',
        //   message: information.labels.formerIcelander.alertDescription,
        //   condition: (answer: Answer) => {
        //     const answers = answer as Citizenship
        //     return answers?.formerIcelander && answers?.formerIcelander !== YES
        //   },
        //   links: [
        //     {
        //       title: information.labels.formerIcelander.alertLinkTitle,
        //       url: information.labels.formerIcelander.alertLinkUrl,
        //       isExternal: true,
        //     },
        //   ],
        // }),
      ],
    }),
  ],
})
