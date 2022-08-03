import get from 'lodash/get'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { sectionRequirements } from './sectionRequirements'
import { sectionLookupStudent } from './sectionLookupStudent'
import { sectionFakeData } from './sectionFakeData'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'PrerequisitesDraft',
    title: 'Skilyrði',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'conditions',
        title: m.externalDataSectionTitle,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: 'Utanaðkomandi gögn',
            dataProviders: [
              buildDataProviderItem({
                id: 'currentLicense',
                type: 'CurrentLicenseProvider',
                title: m.titleCurrentLicenseProvider,
                subTitle: m.descriptionCurrentLicenseProvider,
              }),
            ],
          }),
          sectionLookupStudent,
          sectionRequirements,
        ],
      }),
      buildSection({
        id: '',
        title: m.doneTitle,
        children: [],
      }),
    ],
  })
}
