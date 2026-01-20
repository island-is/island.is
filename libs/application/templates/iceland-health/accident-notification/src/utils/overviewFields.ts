import {
  buildOverviewField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'

import { buildAlertMessageField } from '@island.is/application/core'

import { buildDescriptionField } from '@island.is/application/core'
import { overview } from '../lib/messages/overview'
import {
  accidentDetails,
  accidentLocation,
  applicantInformation,
  childInCustody,
  fishingCompanyInfo,
  hindrances,
  injuredPersonInformation,
  inReview,
  juridicalPerson,
  locationAndPurpose,
} from '../lib/messages'
import {
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
} from './reportingUtils'
import {
  aboutApplicantItems,
  accidentDescriptionItems,
  childInCustodyItems,
  fileItems,
  fishingShipInfoItems,
  hindrancesItems,
  homeAccidentItems,
  injuredPersonItems,
  juridicalPersonItems,
  locationAndPurposeItems,
  representativeItems,
  workplaceDataItems,
} from './overviewItems'
import { isReportingOnBehalfOfInjured } from './reportingUtils'
import { getWorkplaceData } from './miscUtils'
import {
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isProfessionalAthleteAccident,
} from './occupationUtils'
import { hideLocationAndPurpose } from './miscUtils'
import { isHomeActivitiesAccident } from './accidentUtils'
import { missingDocuments } from './documentUtils'

export const overviewFields = (isAssignee?: boolean) => {
  return [
    buildDescriptionField({
      id: 'overview.description',
      description: overview.general.description,
    }),
    buildAlertMessageField({
      condition: (_answers, externalData) => {
        const documentId = getValueViaPath<string>(
          externalData,
          'submitApplication.data.documentId',
        )
        return Boolean(documentId)
      },
      id: 'overview.alertMessage',
      alertType: 'info',
      title: inReview.application.documentIdAlertTitle,
      message: (application) => {
        const documentId =
          getValueViaPath<string>(
            application.externalData,
            'submitApplication.data.documentId',
          ) ?? ''
        return {
          ...inReview.application.documentIdAlertMessage2,
          values: {
            docId: documentId,
          },
        }
      },
    }),
    // Upplýsingar um þig
    buildOverviewField({
      id: 'overview.submit.applicant',
      backId: isAssignee ? undefined : 'applicant',
      title: isAssignee
        ? applicantInformation.forThirdParty.title
        : applicantInformation.general.title,
      items: aboutApplicantItems,
    }),
    // Upplýsingar um þann slasaða
    buildOverviewField({
      condition: isReportingOnBehalfOfInjured,
      id: 'overview.submit.injuredPerson',
      backId: isAssignee ? undefined : 'injuredPersonInformation',
      title: injuredPersonInformation.general.heading,
      items: injuredPersonItems,
    }),
    // Upplýsingar um barn
    buildOverviewField({
      condition: isReportingOnBehalfOfChild,
      id: 'overview.submit.child',
      backId: isAssignee ? undefined : 'childInCustody.fields',
      title: childInCustody.general.screenTitle,
      items: childInCustodyItems,
    }),
    // Upplýsingar um lögaðila
    buildOverviewField({
      condition: isReportingOnBehalfOfEmployee,
      backId: isAssignee ? undefined : 'juridicalPerson.company',
      id: 'overview.submit.employee',
      title: juridicalPerson.general.title,
      items: juridicalPersonItems,
    }),
    // Staðsetning
    buildOverviewField({
      condition: (answers) => {
        const locationAndPurpose = getValueViaPath<{ location: string }>(
          answers,
          'locationAndPurpose',
        )
        return (
          (locationAndPurpose &&
            !isFishermanAccident(answers) &&
            !hideLocationAndPurpose(answers)) ??
          false
        )
      },
      id: 'overview.submit.locationAndPurpose',
      backId: isAssignee ? undefined : 'locationAndPurpose',
      title: locationAndPurpose.general.title,
      items: locationAndPurposeItems,
    }),
    // Upplýsingar um atvinnurekanda
    buildOverviewField({
      condition: (answers) => {
        const workplaceData = getWorkplaceData(answers)
        return Boolean(workplaceData && !isReportingOnBehalfOfEmployee(answers))
      },
      id: 'overview.submit.workplaceData',
      backId: isAssignee
        ? undefined
        : (answers) => {
            const workplaceData = getWorkplaceData(answers)
            return workplaceData?.screenId
          },
      title: (application) => {
        const workplaceData = getWorkplaceData(application.answers)
        return workplaceData?.companyInfoMsg.general.title
      },
      items: workplaceDataItems,
    }),
    // Upplýsingar um skip
    buildOverviewField({
      condition: (answers) => {
        const workplaceData = getWorkplaceData(answers)
        return Boolean(
          workplaceData &&
            !isReportingOnBehalfOfEmployee(answers) &&
            isFishermanAccident(answers),
        )
      },
      id: 'overview.submit.fishingCompanyData',
      backId: isAssignee ? undefined : 'fishingShipInfo',
      title: fishingCompanyInfo.general.informationAboutShipTitle,
      items: fishingShipInfoItems,
    }),
    // Upplýsingar um forsvarsmann fyrirtækisins
    buildOverviewField({
      condition: (answers) => {
        const workplaceData = getWorkplaceData(answers)
        const companyOrInstitude = getValueViaPath<Array<string>>(
          answers,
          'isRepresentativeOfCompanyOrInstitue',
        )?.toString()
        return Boolean(
          workplaceData &&
            !isReportingOnBehalfOfEmployee(answers) &&
            companyOrInstitude !== YES,
        )
      },
      id: 'overview.submit.fishingCompanyRepresentative',
      backId: isAssignee
        ? undefined
        : (answers) => {
            const workplaceData = getWorkplaceData(answers)
            return workplaceData?.screenId
          },
      title: (application) => {
        const workplaceData = getWorkplaceData(application.answers)
        return workplaceData?.companyInfoMsg.labels.descriptionField
      },
      items: representativeItems,
    }),
    // Staðsetning á slysi
    buildOverviewField({
      condition: isHomeActivitiesAccident,
      id: 'overview.submit.isHomeActivitiesAccident',
      backId: isAssignee ? undefined : 'accidentLocation.homeAccident',
      title: accidentLocation.homeAccidentLocation.title,
      items: homeAccidentItems,
    }),
    // Almennt
    buildOverviewField({
      condition: (answers) => {
        return (
          isProfessionalAthleteAccident(answers) ||
          isGeneralWorkplaceAccident(answers) ||
          isAgricultureAccident(answers)
        )
      },
      id: 'overview.submit.hindrances',
      backId: isAssignee ? undefined : 'sportsClubInfo.employee.field',
      title: hindrances.general.sectionTitle,
      items: hindrancesItems,
    }),
    // Lýsing á slysi
    buildOverviewField({
      id: 'overview.submit.accidentDetails',
      backId: isAssignee ? undefined : 'accidentDetails',
      title: accidentDetails.general.sectionTitle,
      items: accidentDescriptionItems,
    }),
    // Fylgiskjöl
    buildOverviewField({
      id: 'overview.submit.files',
      title: overview.labels.attachments,
      attachments: fileItems,
      bottomLine: true,
    }),
    // TODO: list of missing files in the alert
    buildAlertMessageField({
      condition: (answers) => {
        const missing = missingDocuments(answers)
        return missing.length > 0
      },
      id: 'overview.alertMessage',
      alertType: 'warning',
      title: overview.alertMessage.title,
      message: (application) => {
        const missing = missingDocuments(application.answers)
        const missingFiles = missing.map((doc) => doc.defaultMessage).join(', ')
        return {
          ...overview.alertMessage.descriptionWithFiles,
          values: { missingFiles },
        }
      },
    }),
  ]
}
