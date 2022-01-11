import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { DataProviderTypes } from '../lib/types'

import * as m from '../lib/messages'

export const Prerequesites: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
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
