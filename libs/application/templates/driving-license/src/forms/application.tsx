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
  buildCustomField,
  buildSelectField,
  buildDividerField,
  Form,
  FormModes,
  DefaultEvents,
  StaticText,
} from '@island.is/application/core'
import { NationalRegistryUser, UserProfile } from '../types/schema'
import { m } from '../lib/messages'
import { Juristiction } from '../types/schema'
import { format as formatKennitala } from 'kennitala'
import { Provider } from 'reakit/ts'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: m.applicationName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [
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
              id: 'eligibility',
              type: 'EligibilityProvider',
              title: 'Upplýsingar úr ökuskírteinaskrá',
              subTitle:
                'Staðfesting akstursmats, punktastaða, sviptingar, ökuréttindi og almennar upplýsingar um skilríki',
            }),
            buildDataProviderItem({
              id: 'juristictions',
              type: 'JuristictionProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'PaymentCatalogProvider',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'requirements',
      title: 'Skilyrði umsóknar',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Skilyrði sem umsækjandi þarf að uppfylla',
          children: [
            buildCustomField({
              title: 'XXYYZZ',
              component: 'EligibilitySummary',
              id: 'eligsummary',
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
          title: m.pickupLocationTitle,
          children: [
            buildKeyValueField({
              label: m.informationApplicant,
              value: '',
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
            buildDescriptionField({
              id: 'afhending',
              title: 'Afhending',
              titleVariant: 'h4',
              description:
                'Veldu það embætti sýslumanns sem þú vilt skila inn bráðabirgðaskírteini og fá afhennt nýtt fullnaðarskírteini',
            }),
            buildSelectField({
              id: 'juristiction',
              title: 'Afhending',
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
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Panta ökuskírteini',
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Halda áfram',
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
              value: 'Arnór Heiðar Sigurðsson',
              // value: ({ answers: { teacher } }) => teacher as string,
            }),
            buildDividerField({}),
            buildCheckboxField({
              id: 'willBringAlongData',
              title: m.overviewBringData,
              options: (app) => {
                const options = [
                  {
                    value: 'picture',
                    label: m.qualityPhotoAcknowledgement,
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
            buildDividerField({}),
            buildKeyValueField({
              label: m.overviewPaymentCharge,
              value: ({ externalData }) => {
                /// needs a lot of refactoring
                let str = Object.values(externalData.payment.data as object)
                /// more refactoring
                return (parseInt(str[1], 10) + ' kr.') as StaticText
              },
              width: 'full',
            }),
          ],
        }),
      ],
    }),
  ],
})
