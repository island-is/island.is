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
  title: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'type',
      title: 'Ökuréttindi',
      children: [
        buildExternalDataProvider({
          title: 'Upplýsingasöfnun og skilyrði',
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: 'Persónuuplýsingar úr Þjóðskrá',
              subTitle:
                'Til þess að auðvelda fyrir sækjum við persónuuplýsingar úr Þjóðskrá til þess að fylla út í umsóknina',
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: 'Netfang og símanúmer úr þínum stillingum',
              subTitle:
                'Til þess að auðvelda umsóknarferlið er gott að hafa stillt netfang og símanúmer á mínum síðum',
            }),
            buildDataProviderItem({
              id: 'penaltyPoints',
              type: 'PenaltyPointsProvider',
              title: 'Punktastaða úr Ökuskírteinaskrá',
              subTitle:
                'Til þess að tryggja að notandi hafi heimild til þess að sækja um ökuskírteini út frá punktastöðu',
            }),
            buildDataProviderItem({
              id: 'residence',
              type: undefined,
              title: 'Búseta',
              subTitle:
                'Ég hef fasta búsetu hér á landi eins og hún er skilgreind í VIII. viðauka reglugerðar um ökuskírteini eða tel mig fullnægja skilyrðum um búsetu hér á landi til að fá gefið út ökuskírteini.',
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
          id: 'user',
          title: 'Ég er að sækja um:',
          children: [
            buildCheckboxField({
              id: 'type',
              title: 'Tegund ökutækja',
              options: [
                { value: 'general', label: 'Almenn ökuréttindi' },
                { value: 'bike', label: 'Bifhjólaréttindi' },
                { value: 'trailer', label: 'Kerrur og eftirvagnar' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'subType',
      title: 'Tegund',
      children: [
        buildMultiField({
          id: 'subType',
          title: 'Ég er að sækja um:',
          space: 6,
          children: [
            buildCheckboxField({
              id: 'subType',
              title: 'Fólksbílaflokkar',
              condition: ({ type }) =>
                (type as string[])?.includes('general') ||
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
              title: 'Bifhjólaflokkar',
              condition: ({ type }) => (type as string[])?.includes('bike'),
              options: (app) => {
                const entitlementTypes = app.externalData.entitlementTypes
                  .data as DrivingLicenseType[]
                return [
                  buildEntitlementOption(entitlementTypes, 'A'),
                  buildEntitlementOption(entitlementTypes, 'A1'),
                  {
                    ...buildEntitlementOption(entitlementTypes, 'A2'),
                    tooltip: `<h2>A2 flokkur</h2>
  <br />
  Veitir ökuréttindi til að stjórna bifhjóli:
  <br /><br />
  1. á tveimur hjólum með eða án hliðarvagns, með afl sem er ekki yfir 35 kw, með afl/þyngdarhlutfall sem er ekki yfir 0,2 kw/kg, svo og   bifhjóli sem hefur ekki verið breytt frá því að hafa áður meira en tvöfalt afl.
  <br /><br />
  2. bifhjóli í flokki A1.
  <br /><br />
  3. léttu bifhjóli í flokki AM.
  <br /><br />
  Ökuskírteini fyrir A2 flokk fyrir bifhjólaréttindi geta þeir fengið sem náð hafa 19 ára aldri. Taka þarf bóklegt námskeið fyrir A réttindi og 11 stundir í verklegri kennslu, ath að 5 stundir fást metnar ef viðkomandi aðili hefur fyrir A1 réttindi`,
                  },
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
      title: 'Upplýsingar',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Upplýsingar',
          children: [
            buildKeyValueField({
              label: 'Umsækjandi',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildDividerField({
              title: 'Ökukennari',
              color: 'dark400',
            }),
            buildTextField({
              id: 'teacher',
              title: 'Ökukennari',
              width: 'half',
              backgroundColor: 'blue',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: 'Heilbrigðisyfirlýsing',
      children: [
        buildCustomField({
          id: 'healthDeclaration',
          title: 'Heilbrigðisyfirlýsing',
          component: 'HealthDeclaration',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: 'Staðfesting',
      children: [
        buildMultiField({
          id: 'overview',
          title: 'Yfirlit',
          space: 1,
          description:
            'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
          children: [
            buildKeyValueField({
              label: 'Tegund ökuréttinda',
              value: ({ answers: { subType } }) =>
                (subType as string[]).reduce(
                  (acc, type) => `${acc}\n${type}`,
                  '',
                ),
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: 'Nafn',
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildKeyValueField({
              label: 'Sími',
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).mobilePhoneNumber,
            }),
            buildKeyValueField({
              label: 'Heimili',
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  .streetAddress,
            }),
            buildKeyValueField({
              label: 'Kennitala',
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).nationalId,
            }),
            buildKeyValueField({
              label: 'Póstnúmer',
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address
                  .postalCode,
            }),
            buildKeyValueField({
              label: 'Netfang',
              width: 'half',
              value: ({ externalData: { userProfile } }) =>
                (userProfile.data as UserProfile).email,
            }),
            buildKeyValueField({
              label: 'Staður',
              width: 'half',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).address.city,
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: 'Ökukennari',
              value: ({ answers: { teacher } }) => teacher,
            }),
            buildDividerField({}),
            buildCheckboxField({
              id: 'bringAlong',
              title: 'Gögn höfð meðferðis til sýslumanns',
              options: [
                {
                  value: 'certificate',
                  label: 'Ég kem með vottorð frá lækni meðferðis',
                },
                {
                  value: 'photo',
                  label: 'Ég kem með mynd og rithandarsýni til sýslumanns',
                },
              ],
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'sick',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Smelltu hér til að senda inn umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'overview',
          title: 'Til hamingju',
          description:
            'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
        }),
      ],
    }),
  ],
})
