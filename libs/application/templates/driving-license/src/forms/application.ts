import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
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
  buildSubSection,
  getValueViaPath,
  buildDataProviderItem,
  FormValue,
} from '@island.is/application/core'
import { LogreglanLogo } from '../assets'
import { NationalRegistryUser, Teacher, UserProfile } from '../types/schema'
import { m } from '../lib/messages'
import { Juristiction } from '../types/schema'
import { format as formatKennitala } from 'kennitala'
import { QualityPhotoData, ConditionFn } from '../types'
import { StudentAssessment } from '@island.is/api/schema'
import { NO, YES } from '../lib/constants'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_TEMP,
} from '../shared/constants'
import { hasYes } from '../utils'

const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result

const needsHealthCertificateCondition = (result = YES) => (
  answers: FormValue,
) => {
  return Object.values(answers?.healthDeclaration || {}).includes(result)
}

const isVisible = (...fns: ConditionFn[]) => (answers: FormValue) =>
  fns.reduce((s, fn) => (!s ? false : fn(answers)), true)

const isApplicationForCondition = (result: DrivingLicenseApplicationFor) => (
  answers: FormValue,
) => {
  const applicationFor: string[] = getValueViaPath(answers, 'applicationFor', [
    B_FULL,
  ]) as string[]
  return applicationFor.includes(result)
}

const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  !hasYes(answers?.drivingLicenseInOtherCountry)

const chooseDistrictCommissionerDescription = ({
  answers,
}: {
  answers: FormValue
}) => {
  const applicationFor = getValueViaPath(
    answers,
    'applicationFor',
    B_FULL,
  ) as string

  switch (applicationFor) {
    case B_TEMP:
      return m.chooseDistrictCommisionerForTempLicense.defaultMessage
    case B_FULL:
      return m.chooseDistrictCommisionerForFullLicense.defaultMessage
    default:
      return ''
  }
}

export const getApplication = (
  allowFakeData = true,
  allowPickLicense = true,
): Form => {
  const allowLicenseSelection = () => allowPickLicense

  return buildForm({
    id: 'DrivingLicenseApplicationDraftForm',
    title: m.applicationName,
    logo: LogreglanLogo,
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSection,
        children: [
          ...(allowFakeData
            ? [
                buildSubSection({
                  id: 'fakeData',
                  title: 'Gervigögn',
                  children: [
                    buildMultiField({
                      id: 'shouldFake',
                      title: 'Gervigögn',
                      children: [
                        buildDescriptionField({
                          id: 'gervigognDesc',
                          title: 'Viltu nota gervigögn?',
                          titleVariant: 'h5',
                          // Note: text is rendered by a markdown component.. and when
                          // it sees the indented spaces it seems to assume this is code
                          // and so it will wrap the text in a <code> block when the double
                          // spaces are not removed.
                          description: `
                            Ath. gervigögn eru eingöngu notuð í stað þess að sækja
                            forsendugögn í staging umhverfi (dev x-road) hjá RLS, auk þess
                            sem hægt er að senda inn umsóknina í "þykjó" - þeas. allt hagar sér
                            eins nema að RLS tekur ekki við umsókninni.

                            Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
                            til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
                            ökuréttindi í staging grunni RLS.
                          `.replace(/\s{2}/g, ''),
                        }),
                        buildRadioField({
                          id: 'fakeData.useFakeData',
                          title: '',
                          width: 'half',
                          options: [
                            {
                              value: YES,
                              label: 'Já',
                            },
                            {
                              value: NO,
                              label: 'Nei',
                            },
                          ],
                        }),
                        buildRadioField({
                          id: 'fakeData.currentLicense',
                          title: 'Núverandi ökuréttindi umsækjanda',
                          width: 'half',
                          condition: allowFakeCondition(YES),
                          options: [
                            {
                              value: 'student',
                              label: 'Engin',
                            },
                            {
                              value: 'temp',
                              label: 'Bráðabirgðaskírteini',
                            },
                          ],
                        }),
                        buildRadioField({
                          id: 'fakeData.qualityPhoto',
                          title: 'Gervimynd eða enga mynd?',
                          width: 'half',
                          condition: allowFakeCondition(YES),
                          options: [
                            {
                              value: YES,
                              label: 'Mynd',
                            },
                            {
                              value: NO,
                              label: 'Engin mynd',
                            },
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ]
            : []),
          buildExternalDataProvider({
            title: m.externalDataTitle,
            id: 'approveExternalData',
            subTitle: m.externalDataSubTitle,
            checkboxLabel: m.externalDataAgreement,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.nationalRegistryTitle,
                subTitle: m.nationalRegistrySubTitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.userProfileInformationTitle,
                subTitle: m.userProfileInformationSubTitle,
              }),
              buildDataProviderItem({
                id: 'currentLicense',
                type: 'CurrentLicenseProvider',
                title: m.infoFromLicenseRegistry,
                subTitle: m.confirmationStatusOfEligability,
              }),
              buildDataProviderItem({
                id: 'qualityPhoto',
                type: 'QualityPhotoProvider',
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                id: 'studentAssessment',
                type: 'DrivingAssessmentProvider',
                title: '',
              }),
              buildDataProviderItem({
                id: 'juristictions',
                type: 'JuristictionProvider',
                title: '',
              }),
              buildDataProviderItem({
                id: 'payment',
                type: 'FeeInfoProvider',
                title: '',
              }),
              buildDataProviderItem({
                id: 'teachers',
                type: 'TeachersProvider',
                title: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'application',
        title: m.applicationDrivingLicenseTitle,
        condition: allowLicenseSelection,
        children: [
          buildMultiField({
            id: 'info',
            title: m.drivingLicenseApplyingForTitle,
            children: [
              buildRadioField({
                id: 'applicationFor',
                backgroundColor: 'white',
                title: '',
                description: '',
                space: 0,
                largeButtons: true,
                options: [
                  {
                    label: m.applicationForTempLicenseTitle,
                    subLabel:
                      m.applicationForTempLicenseDescription.defaultMessage,
                    value: B_TEMP,
                  },
                  {
                    label: m.applicationForFullLicenseTitle,
                    subLabel:
                      m.applicationForFullLicenseDescription.defaultMessage,
                    value: B_FULL,
                    disabled: true,
                  },
                ],
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'requirements',
        title: m.applicationEligibilityTitle,
        children: [
          buildMultiField({
            id: 'info',
            title: m.eligibilityRequirementTitle,
            children: [
              buildCustomField({
                title: m.eligibilityRequirementTitle,
                component: 'EligibilitySummary',
                id: 'eligsummary',
              }),
            ],
          }),
        ],
      }),
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
                (externalData.qualityPhoto as QualityPhotoData)?.data
                  ?.success === true
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
                (externalData.qualityPhoto as QualityPhotoData)?.data
                  ?.success === false
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
                condition: (answers) =>
                  hasYes(answers?.healthDeclaration || []),
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
                condition: (answers) =>
                  hasYes(answers?.healthDeclaration || {}),
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
}
