import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildKeyValueField,
  buildSubmitField,
  buildCheckboxField,
  buildCustomField,
  buildSelectField,
  buildDividerField,
  buildRadioField,
  buildTextField,
  Form,
  FormModes,
  DefaultEvents,
  StaticText,
  FormValue,
} from '@island.is/application/core'
import { LogreglanLogo } from '../assets'
import {
  Juristiction,
  NationalRegistryUser,
  Teacher,
  UserProfile,
} from '../types/schema'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { HasQualityPhotoData } from '../lib/types'
import { StudentAssessment } from '@island.is/api/schema'
import { NO, YES } from '../lib/constants'
import { B_FULL, B_TEMP } from '../shared/constants'
import {
  chooseDistrictCommissionerDescription,
  hasNoDrivingLicenseInOtherCountry,
  hasYes,
  isApplicationForCondition,
  isVisible,
  needsHealthCertificateCondition,
} from '../lib/utils'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: m.applicationName,
  logo: LogreglanLogo,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'infoStep',
      title: m.informationTitle,
      condition: isApplicationForCondition(B_TEMP),
      children: [
        buildMultiField({
          id: 'info',
          title: m.informationTitle,
          space: 1,
          children: [
            buildKeyValueField({
              label: m.drivingLicenseTypeRequested,
              value: 'Almenn ökuréttindi - B flokkur (Fólksbifreið)',
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
            buildKeyValueField({
              label: m.informationApplicant,
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
              width: 'half',
            }),
            buildKeyValueField({
              label: m.informationStreetAddress,
              value: ({ externalData: { nationalRegistry } }) => {
                const address = (nationalRegistry.data as NationalRegistryUser)
                  .address

                if (!address) {
                  return ''
                }

                const { streetAddress, city } = address

                return `${streetAddress}${city ? ', ' + city : ''}`
              },
              width: 'half',
            }),
            buildTextField({
              id: 'email',
              title: m.informationYourEmail,
              placeholder: 'Netfang',
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
            buildDescriptionField({
              id: 'drivingInstructorTitle',
              title: m.drivingInstructor,
              titleVariant: 'h4',
              description: m.chooseDrivingInstructor,
            }),
            buildSelectField({
              id: 'drivingInstructor',
              title: m.drivingInstructor,
              disabled: false,
              options: ({
                externalData: {
                  teachers: { data },
                },
              }) => {
                return (data as Teacher[]).map(({ name }) => ({
                  value: name,
                  label: name,
                }))
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'otherCountry',
      title: m.foreignDrivingLicense,
      condition: isApplicationForCondition(B_TEMP),
      children: [
        buildMultiField({
          id: 'info',
          title: m.drivingLicenseInOtherCountry,
          space: 1,
          children: [
            buildRadioField({
              id: 'drivingLicenseInOtherCountry',
              backgroundColor: 'white',
              title: '',
              description: '',
              space: 0,
              largeButtons: true,
              options: [
                {
                  label: m.no,
                  subLabel: '',
                  value: NO,
                },
                {
                  label: m.yes,
                  subLabel: '',
                  value: YES,
                },
              ],
            }),
            buildCheckboxField({
              id: 'drivingLicenseDeprivedOrRestrictedInOtherCountry',
              backgroundColor: 'white',
              title: '',
              condition: (answers) =>
                hasYes(answers?.drivingLicenseInOtherCountry || []),
              options: [
                {
                  value: NO,
                  label: m.noDeprivedDrivingLicenseInOtherCountryTitle,
                  subLabel:
                    m.noDeprivedDrivingLicenseInOtherCountryDescription
                      .defaultMessage,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'otherCountrySelected',
      title: 'Leiðbeiningar',
      condition: (answer) => hasYes(answer?.drivingLicenseInOtherCountry),
      children: [
        buildCustomField({
          condition: (answers) =>
            hasYes(answers?.drivingLicenseInOtherCountry || []),
          title: 'SubmitAndDecline',
          component: 'SubmitAndDecline',
          id: 'SubmitAndDecline',
        }),
      ],
    }),
    buildSection({
      id: 'photoStep',
      title: m.applicationQualityPhotoTitle,
      condition: isVisible(
        isApplicationForCondition(B_FULL),
        hasNoDrivingLicenseInOtherCountry,
      ),
      children: [
        buildMultiField({
          id: 'info',
          title: m.qualityPhotoTitle,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === true
            )
          },
          children: [
            buildCustomField({
              title: m.eligibilityRequirementTitle,
              component: 'QualityPhoto',
              id: 'qphoto',
            }),
            buildRadioField({
              id: 'willBringQualityPhoto',
              title: '',
              disabled: false,
              options: [
                { value: NO, label: m.qualityPhotoNoAcknowledgement },
                { value: YES, label: m.qualityPhotoAcknowledgement },
              ],
            }),
            buildCustomField({
              id: 'photdesc',
              title: '',
              component: 'Bullets',
              condition: (answers) => hasYes(answers.willBringQualityPhoto),
            }),
          ],
        }),
        buildMultiField({
          id: 'info',
          title: m.qualityPhotoTitle,
          condition: (answers: FormValue, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === false
            )
          },
          children: [
            buildCustomField({
              title: m.eligibilityRequirementTitle,
              component: 'QualityPhoto',
              id: 'qphoto',
            }),
            buildCustomField({
              id: 'photodescription',
              title: '',
              component: 'Bullets',
            }),
            buildCheckboxField({
              id: 'willBringQualityPhoto',
              title: '',
              options: [
                {
                  value: YES,
                  label: m.qualityPhotoAcknowledgement,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'user',
      title: m.informationSectionTitle,
      condition: hasNoDrivingLicenseInOtherCountry,
      children: [
        buildMultiField({
          id: 'info',
          title: m.pickupLocationTitle,
          space: 1,
          children: [
            buildKeyValueField({
              label: m.informationApplicant,
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
            buildDescriptionField({
              id: 'afhending',
              title: m.districtCommisionerTitle,
              titleVariant: 'h4',
              description: chooseDistrictCommissionerDescription,
            }),
            buildSelectField({
              id: 'juristiction',
              title: m.districtCommisionerPickup,
              disabled: false,
              options: ({
                externalData: {
                  juristictions: { data },
                },
              }) => {
                return (data as Juristiction[]).map(({ id, name, zip }) => ({
                  value: id,
                  label: name,
                  tooltip: `Póstnúmer ${zip}`,
                }))
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: m.healthDeclarationSectionTitle,
      condition: hasNoDrivingLicenseInOtherCountry,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.healthDeclarationMultiFieldTitle,
          space: 1,
          children: [
            buildCustomField(
              {
                id: 'healthDeclaration.usesContactGlasses',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                title: m.healthDeclarationMultiFieldSubTitle,
                label: m.healthDeclaration1,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasReducedPeripheralVision',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration2,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasEpilepsy',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration3,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasHeartDisease',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration4,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasMentalIllness',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration5,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.usesMedicalDrugs',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration6,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isAlcoholic',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration7,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasDiabetes',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration8,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isDisabled',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration9,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasOtherDiseases',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration10,
              },
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewSectionTitle,
      condition: hasNoDrivingLicenseInOtherCountry,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewMultiFieldTitle,
          space: 1,
          description: m.overviewMultiFieldDescription,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.orderDrivingLicense,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
            }),
            buildKeyValueField({
              label: m.overviewSubType,
              value: ({ answers: { subType } }) => subType as string[],
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewName,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildKeyValueField({
              label: m.overviewPhoneNumber,
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).mobilePhoneNumber as string,
            }),
            buildKeyValueField({
              label: m.overviewStreetAddress,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  ?.streetAddress,
            }),
            buildKeyValueField({
              label: m.overviewNationalId,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                formatKennitala(
                  (nationalRegistry.data as NationalRegistryUser).nationalId,
                ),
            }),
            buildKeyValueField({
              label: m.overviewPostalCode,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  ?.postalCode,
            }),
            buildKeyValueField({
              label: m.overviewEmail,
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).email as string,
            }),
            buildKeyValueField({
              label: m.overviewCity,
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address?.city,
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewTeacher,
              width: 'half',
              value: ({ externalData: { studentAssessment } }) =>
                (studentAssessment.data as StudentAssessment).teacherName,
            }),
            buildDividerField({
              condition: (answers) => hasYes(answers?.healthDeclaration || []),
            }),
            buildDescriptionField({
              id: 'bringalong',
              title: m.overviewBringAlongTitle,
              titleVariant: 'h4',
              description: '',
              condition: needsHealthCertificateCondition(YES),
            }),
            buildCheckboxField({
              id: 'certificate',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.overviewBringCertificateData,
                },
              ],
              condition: (answers) => hasYes(answers?.healthDeclaration || {}),
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewPaymentCharge,
              value: ({ externalData, answers }) => {
                const items = externalData.payment.data as {
                  priceAmount: number
                  chargeItemCode: string
                }[]
                const targetCode =
                  answers.applicationFor === B_TEMP ? 'AY114' : 'AY110'

                const item = items.find(
                  ({ chargeItemCode }) => chargeItemCode === targetCode,
                )
                return (item?.priceAmount?.toLocaleString('de-DE') +
                  ' kr.') as StaticText
              },
              width: 'full',
            }),
          ],
        }),
      ],
    }),
  ],
})
