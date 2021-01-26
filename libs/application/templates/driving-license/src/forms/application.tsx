import React from 'react'

import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildKeyValueField,
  buildDataProviderItem,
  buildSubmitField,
  buildCheckboxField,
  buildTextField,
  buildCustomField,
  buildRadioField,
  buildSelectField,
  buildDividerField,
  Form,
  FormModes,
  formatText,
} from '@island.is/application/core'
import {
  NationalRegistryUser,
  DrivingLicenseType,
  UserProfile,
} from '@island.is/api/schema'
import { m } from '../lib/messages'
import { buildEntitlementOption } from '../utils'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: m.applicationName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'type',
      title: m.externalDataSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
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
              id: 'penaltyPoints',
              type: 'PenaltyPointsProvider',
              title: m.penaltyPointsTitle,
              subTitle: m.penaltyPointsSubTitle,
            }),
            buildDataProviderItem({
              id: 'residence',
              type: undefined,
              title: m.residenceTitle,
              subTitle: m.residenceSubTitle,
            }),
            buildDataProviderItem({
              id: 'entitlementTypes',
              type: 'EntitlementTypesProvider',
              title: '',
              subTitle: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'type',
          title: m.typeFieldMultiFieldTitle,
          children: [
            buildCheckboxField({
              id: 'type',
              title: m.typeFieldCheckbox,
              options: [
                { value: 'car', label: m.typeFieldCar },
                { value: 'motorcycle', label: m.typeFieldMotorcycle },
                { value: 'trailer', label: m.typeFieldTrailer },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'subType',
      title: m.subTypeFieldTitle,
      children: [
        buildMultiField({
          id: 'subType',
          title: m.subTypeFieldMultiFieldTitle,
          space: 6,
          children: [
            buildCheckboxField({
              id: 'subType',
              title: m.subTypeFieldCar,
              condition: ({ type }) =>
                (type as string[])?.includes('car') ||
                (type as string[])?.includes('trailer'),
              options: (app) => {
                const entitlementTypes = app.externalData.entitlementTypes
                  .data as DrivingLicenseType[]
                if ((app.answers.type as string[])?.includes('trailer')) {
                  return [buildEntitlementOption(entitlementTypes, 'BE')]
                }

                return [buildEntitlementOption(entitlementTypes, 'B')]
              },
            }),
            buildCheckboxField({
              id: 'subType',
              title: m.subTypeFieldMotorcycle,
              condition: ({ type }) =>
                (type as string[])?.includes('motorcycle'),
              options: (app) => {
                const entitlementTypes = app.externalData.entitlementTypes
                  .data as DrivingLicenseType[]
                return [
                  buildEntitlementOption(entitlementTypes, 'A'),
                  buildEntitlementOption(entitlementTypes, 'A1'),
                  buildEntitlementOption(entitlementTypes, 'A2'),
                  buildEntitlementOption(entitlementTypes, 'AM'),
                ]
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'user',
      title: m.informationSectionTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.informationMultiFieldTitle,
          children: [
            buildKeyValueField({
              label: m.informationApplicant,
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildDividerField({
              title: m.informationTeacher,
              color: 'dark400',
            }),
            buildTextField({
              id: 'teacher',
              title: m.informationTeacher,
              width: 'half',
              backgroundColor: 'blue',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: m.healthDeclarationSectionTitle,
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
                id: 'healthDeclaration.hasEpilepsy',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration2,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasHeartDisease',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration3,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasMentalIllness',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration4,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.usesMedicalDrugs',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration5,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isAlcoholic',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration6,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasDiabetes',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration7,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.isDisabled',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration8,
              },
            ),
            buildCustomField(
              {
                id: 'healthDeclaration.hasOtherDiseases',
                title: '',
                component: 'HealthDeclaration',
              },
              {
                label: m.healthDeclaration9,
              },
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewSectionTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewMultiFieldTitle,
          space: 1,
          description: m.overviewMultiFieldDescription,
          children: [
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
                (nationalRegistry.data as NationalRegistryUser).nationalId,
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
              value: ({ answers: { teacher } }) => teacher as string,
            }),
            buildDividerField({}),
            buildCheckboxField({
              id: 'willBringAlongData',
              title: m.overviewBringData,
              options: (app) => {
                const options = [
                  {
                    value: 'picture',
                    label: m.overviewBringPhoneData,
                  },
                ]
                if (
                  Object.values(app.answers.healthDeclaration).includes('yes')
                ) {
                  return [
                    {
                      value: 'certificate',
                      label: m.overviewBringCertificateData,
                    },
                    ...options,
                  ]
                }
                return options
              },
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'submit',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.overviewSubmit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'overview',
          component: 'Congratulations',
          title: ({ externalData: { nationalRegistry } }) => [
            m.overviewCongratulations,
            ' ',
            (nationalRegistry?.data as NationalRegistryUser)?.fullName.split(
              ' ',
            )[0],
          ],
        }),
      ],
    }),
  ],
})
