import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  buildDescriptionField,
  buildAlertMessageField,
  YES,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
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
  overview,
} from '../../lib/messages'
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
} from '../../utils/overviewItems'
import { missingDocuments } from '../../utils/documentUtils'
import {
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
} from '../../utils/reportingUtils'
import { getWorkplaceData, hideLocationAndPurpose } from '../../utils/miscUtils'
import {
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isProfessionalAthleteAccident,
} from '../../utils/occupationUtils'
import { isHomeActivitiesAccident } from '../../utils/accidentUtils'

export const overviewSection = buildSection({
  id: 'overview.section',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview.multifield',
      title: overview.general.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'overview.description',
          description: overview.general.description,
        }),
        buildAlertMessageField({
          condition: (answers, externalData) => {
            const documentId = getValueViaPath<string>(
              externalData,
              'submitApplication.data.documentId',
            )
            return documentId ? true : false
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
          backId: 'applicant',
          title: applicantInformation.general.title,
          items: aboutApplicantItems,
        }),
        // Upplýsingar um þann slasaða
        buildOverviewField({
          condition: isReportingOnBehalfOfInjured,
          id: 'overview.submit.injuredPerson',
          backId: 'injuredPersonInformation',
          title: injuredPersonInformation.general.heading,
          items: injuredPersonItems,
        }),
        // Upplýsingar um barn
        buildOverviewField({
          condition: isReportingOnBehalfOfChild,
          id: 'overview.submit.child',
          backId: 'childInCustody.fields',
          title: childInCustody.general.screenTitle,
          items: childInCustodyItems,
        }),
        // Upplýsingar um lögaðila
        buildOverviewField({
          condition: isReportingOnBehalfOfEmployee,
          backId: 'juridicalPerson.company',
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
          backId: 'locationAndPurpose',
          title: locationAndPurpose.general.title,
          items: locationAndPurposeItems,
        }),
        // Upplýsingar um atvinnurekanda
        buildOverviewField({
          condition: (answers) => {
            const workplaceData = getWorkplaceData(answers)
            return workplaceData && !isReportingOnBehalfOfEmployee(answers)
              ? true
              : false
          },
          id: 'overview.submit.workplaceData',
          backId: (answers) => {
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
            return workplaceData &&
              !isReportingOnBehalfOfEmployee(answers) &&
              isFishermanAccident(answers)
              ? true
              : false
          },
          id: 'overview.submit.fishingCompanyData',
          backId: 'fishingShipInfo',
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
            return workplaceData &&
              !isReportingOnBehalfOfEmployee(answers) &&
              companyOrInstitude !== YES
              ? true
              : false
          },
          id: 'overview.submit.fishingCompanyRepresentative',
          backId: (answers) => {
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
          backId: 'accidentLocation.homeAccident',
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
          backId: 'sportsClubInfo.employee.field',
          title: hindrances.general.sectionTitle,
          items: hindrancesItems,
        }),
        // Lýsing á slysi
        buildOverviewField({
          id: 'overview.submit.accidentDetails',
          backId: 'accidentDetails',
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
          message: overview.alertMessage.descriptionWithFiles,
        }),
        buildSubmitField({
          id: 'overview.submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.labels.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
