import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { betaTest, externalData } from '../../../lib/messages'

export const agreementDescriptionMultiField = buildMultiField({
  title: externalData.agreementDescription.sectionTitle,
  id: 'agreementDescriptionMultiField',
  nextButtonText: betaTest.nextButtonText,
  space: 2,
  children: [
    buildCustomField({
      id: 'agreementDescriptionCustomField',
      title: '',
      component: 'AgreementDescription',
      doesNotRequireAnswer: true,
    }),
    buildCustomField(
      {
        id: 'extrainformationWithDataprovider',
        title: '',
        component: 'DescriptionWithLink',
        doesNotRequireAnswer: true,
      },
      {
        descriptionFirstPart: externalData.extraInformation.description,
        descriptionSecondPart: '',
        linkName: externalData.extraInformation.linkText,
        url: externalData.extraInformation.link,
      },
    ),
  ],
})
