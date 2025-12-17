import {
  buildAlertMessageField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    // buildSection({
    //   id: 'preInformation',
    //   title: externalData.preInformation.sectionTitle,

    //   children: [
    //     buildMultiField({
    //       id: 'preInformation.multifield',
    //       title: externalData.preInformation.sectionTitle,
    //       description: externalData.preInformation.description,
    //       children: [
    //         buildAlertMessageField({
    //           id: 'preInformation.alertField.hasValidCard',
    //           alertType: 'info',
    //           message: externalData.preInformation.hasValidCardAlert,
    //           marginTop: 0,
    //         }),
    //         buildAlertMessageField({
    //           id: 'preInformation.alertField.lostOldCard',
    //           alertType: 'info',
    //           message: externalData.preInformation.lostOldCardAlert,
    //           marginTop: 0,
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            // buildDataProviderItem({
            //   provider: CurrentVehiclesApi,
            //   title: externalData.transportAuthority.title,
            //   subTitle: externalData.transportAuthority.subTitle,
            // }),
          ],
        }),
      ],
    }),
  ],
})
