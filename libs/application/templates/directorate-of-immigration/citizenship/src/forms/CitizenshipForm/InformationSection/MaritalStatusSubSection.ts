import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { formatDate } from '../../../utils'
import { Routes } from '../../../lib/constants'
import {
  NationalRegistryIndividual,
  NationalRegistrySpouse,
  SpouseSource,
} from '@island.is/application/types'

export const MaritalStatusSubSection = buildSubSection({
  id: Routes.MARITALSTATUS,
  title: information.labels.maritalStatus.subSectionTitle,
  condition: (_, externalData) => {
    // TODO REVERT THIS WHEN UTL FIXES SERVICES
    // Check if the only residence condition that the applicant can apply for, is related to marital status
    // const residenceConditionInfo = getValueViaPath(
    //   externalData,
    //   'applicantInformation.data.residenceConditionInfo',
    //   {},
    // ) as ApplicantInformation

    // const hasResConMaritalStatus =
    //   residenceConditionInfo.cohabitationISCitizen5YearDomicile ||
    //   residenceConditionInfo.cohabitationISCitizen5YrsDomicileMissingDate ||
    //   residenceConditionInfo.marriedISCitizenDomicile4Years ||
    //   residenceConditionInfo.marriedISCitizenDomicile4YrsMissingDate

    // const hasOtherValidResidenceConditions =
    //   residenceConditionInfo.domicileResidence7Years ||
    //   residenceConditionInfo.asylumSeekerOrHumanitarianResPerm5year ||
    //   residenceConditionInfo.noNationalityAnd5YearsDomicile ||
    //   residenceConditionInfo.nordicCitizenship4YearDomicile

    // const spouseIsCitizen = residenceConditionInfo.spouseIsCitizen
    // const eesResidenceCondition = residenceConditionInfo.eesResidenceCondition
    // const showThisPage = spouseIsCitizen && !eesResidenceCondition

    // return (
    //   (!!hasResConMaritalStatus && !hasOtherValidResidenceConditions) ||
    //   !!showThisPage
    // )

    // TODO REMOVE THIS WHEN UTL FIXES SERVICES
    const spouseDetails = getValueViaPath(
      externalData,
      'spouseDetails.data',
      undefined,
    ) as NationalRegistrySpouse | undefined

    const hasSpouse = !!spouseDetails?.nationalId

    return hasSpouse
  },
  children: [
    buildMultiField({
      id: Routes.MARITALSTATUS,
      title: information.labels.maritalStatus.pageTitle,
      children: [
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: information.labels.maritalStatus.titleStatus,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'maritalStatus.status',
          title: information.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseInformation = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseInformation?.maritalStatus
          },
        }),
        buildTextField({
          id: 'maritalStatus.dateOfMaritalStatusStr',
          title: information.labels.maritalStatus.marriedStatusDate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.lastModified
              ? formatDate(new Date(spouseDetails.lastModified))
              : ''
          },
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: information.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          required: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.nationalId
          },
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: information.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.name
          },
        }),
        buildTextField({
          id: 'maritalStatus.birthCountry',
          title: information.labels.maritalStatus.spouseBirthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.birthplace?.location
              ? spouseDetails?.birthplace?.location
              : ''
          },
        }),
        buildTextField({
          id: 'maritalStatus.citizenship',
          title: information.labels.maritalStatus.spouseCitizenship,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return spouseDetails?.citizenship?.name
              ? spouseDetails?.citizenship?.name
              : ''
          },
        }),
        buildTextField({
          id: 'maritalStatus.applicantAddress',
          title: information.labels.maritalStatus.applicantAddress,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath<NationalRegistryIndividual>(
              application.externalData,
              'individual.data',
              undefined,
            )

            return `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
          },
          condition: (_, externalData) => {
            const individual = getValueViaPath<NationalRegistryIndividual>(
              externalData,
              'individual.data',
              undefined,
            )

            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              externalData,
              'spouseDetails.data',
              undefined,
            )

            const myAddressCombination = `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
            const mySpouseAddressCombination = `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildTextField({
          id: 'maritalStatus.spouseAddress',
          title: information.labels.maritalStatus.spouseAddress,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              application.externalData,
              'spouseDetails.data',
              undefined,
            )

            return `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
          },
          condition: (_, externalData) => {
            const individual = getValueViaPath<NationalRegistryIndividual>(
              externalData,
              'individual.data',
              undefined,
            )

            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              externalData,
              'spouseDetails.data',
              undefined,
            )

            const myAddressCombination = `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
            const mySpouseAddressCombination = `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildDescriptionField({
          id: 'maritalStatus.explanationTitle',
          title: information.labels.maritalStatus.explanationTitle,
          titleVariant: 'h5',
          space: 'gutter',
          condition: (_, externalData) => {
            const individual = getValueViaPath<NationalRegistryIndividual>(
              externalData,
              'individual.data',
              undefined,
            )

            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              externalData,
              'spouseDetails.data',
              undefined,
            )

            const myAddressCombination = `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
            const mySpouseAddressCombination = `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
        buildTextField({
          id: 'maritalStatus.explanation',
          title: information.labels.maritalStatus.explanation,
          backgroundColor: 'blue',
          width: 'full',
          variant: 'textarea',
          condition: (_, externalData) => {
            const individual = getValueViaPath<NationalRegistryIndividual>(
              externalData,
              'individual.data',
              undefined,
            )

            const spouseDetails = getValueViaPath<NationalRegistrySpouse>(
              externalData,
              'spouseDetails.data',
              undefined,
            )

            const myAddressCombination = `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
            const mySpouseAddressCombination = `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
      ],
    }),
  ],
})
