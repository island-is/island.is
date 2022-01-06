import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { DataProviderTypes } from '../types'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'nationalRegistryData',
      title: m.section.dataGathering,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: m.externalData.general.subTitle,
          description: m.externalData.general.description,
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
