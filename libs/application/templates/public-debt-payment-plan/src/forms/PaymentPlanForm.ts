import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildMultiField,
  ExternalData,
} from '@island.is/application/core'
import { section, application } from '../lib/messages'
import { externalData } from '../lib/messages/externalData'
import { prerequisitesFailed } from '../lib/paymentPlanUtils'

export const PaymentPlanForm: Form = buildForm({
  id: 'PaymentPlanForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: section.externalData,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.general.pageTitle,
          description: '',
          subTitle: externalData.general.subTitle,
          checkboxLabel: externalData.general.checkboxLabel,
          dataProviders: [
            // TODO: we might have to define several external data points here
            // since this data originates from more than one location
            buildDataProviderItem({
              id: 'paymentPlanPrerequisites',
              title: externalData.labels.paymentPlanTitle,
              type: 'PaymentPlanPrerequisites',
              subTitle: externalData.labels.paymentPlanSubtitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'prerequisitesErrorWall',
          title: externalData.general.pageTitle,
          children: [
            buildDescriptionField({
              id: 'prerequisitesErrorDescriptionField',
              title: '',
              description: '',
            }),
            buildCustomField({
              id: 'prerequisitesErrorModal',
              component: 'PrerequisitesErrorModal',
              title: '',
            }),
          ],
          condition: (_formValue, externalData) => {
            return prerequisitesFailed(externalData)
          },
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField2',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField3',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'paymentPlan',
      title: section.paymentPlan,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField4',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField5',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: section.confirmation,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField6',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
