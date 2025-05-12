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

    const maritalStatus = spouseDetails?.maritalStatus
    const hasSpouse = !!spouseDetails?.nationalId
    const isMarriedOrCohabitation =
      maritalStatus === '3' || (maritalStatus === '1' && hasSpouse)

    return isMarriedOrCohabitation
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
        // If married:
        buildTextField({
          id: 'maritalStatus.status',
          title: information.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => {
            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined
            const maritalStatus = spouseDetails?.maritalStatus

            const isMarried = maritalStatus === '3'
            return isMarried
          },
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.maritalTitle?.description
          },
        }),
        // If married:
        buildTextField({
          id: 'maritalStatus.dateOfMaritalStatusStr',
          title: information.labels.maritalStatus.marriedStatusDate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => {
            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined
            const maritalStatus = spouseDetails?.maritalStatus

            const isMarried = maritalStatus === '3'
            return isMarried
          },
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

            return spouseDetails?.lastModified
              ? formatDate(new Date(spouseDetails.lastModified))
              : ''
          },
        }),
        // If cohabitation:
        buildTextField({
          id: 'maritalStatus.status',
          title: information.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => {
            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined
            const maritalStatus = spouseDetails?.maritalStatus
            const hasSpouse = !!spouseDetails?.nationalId

            const isCohabitation = maritalStatus === '1' && hasSpouse
            return isCohabitation
          },
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.maritalTitle?.description
          },
        }),
        // If cohabitation:
        buildTextField({
          id: 'maritalStatus.dateOfMaritalStatusStr',
          title: information.labels.maritalStatus.cohabitationStatusDate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => {
            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined
            const maritalStatus = spouseDetails?.maritalStatus
            const hasSpouse = !!spouseDetails?.nationalId

            const isCohabitation = maritalStatus === '1' && hasSpouse
            return isCohabitation
          },
          defaultValue: (application: Application) => {
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
          },
          condition: (_, externalData) => {
            const individual = getValueViaPath(
              externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const spouseDetails = getValueViaPath(
              application.externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

            return `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
          },
          condition: (_, externalData) => {
            const individual = getValueViaPath(
              externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const individual = getValueViaPath(
              externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

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
            const individual = getValueViaPath(
              externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const spouseDetails = getValueViaPath(
              externalData,
              'spouseDetails.data',
              undefined,
            ) as NationalRegistrySpouse | undefined

            const myAddressCombination = `${individual?.address?.streetAddress}, ${individual?.address?.postalCode} ${individual?.address?.city}`
            const mySpouseAddressCombination = `${spouseDetails?.address?.streetAddress}, ${spouseDetails?.address?.postalCode} ${spouseDetails?.address?.city}`
            return myAddressCombination !== mySpouseAddressCombination
          },
        }),
      ],
    }),
  ],
})
