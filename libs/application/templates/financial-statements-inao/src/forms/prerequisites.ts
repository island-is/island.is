import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { FSIUSERTYPE } from '../types'

import { m } from '../lib/messages'
import { Logo } from '../components'
import { getCurrentUserType } from '../lib/utils/helpers'

export const getForm = (): Form =>
  buildForm({
    id: 'prerequisites',
    title: m.dataCollectionTitle,
    logo: Logo,
    mode: FormModes.APPLYING,

    children: [
      buildSection({
        id: 'ExternalDataSection',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'IdentityProvider',
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                id: 'currentUserType',
                type: 'CurrentUserTypeProvider',
                title: '',
                subTitle: '',
              }),
            ],
          }),
          buildSubmitField({
            id: 'getDataSuccess.toDraft',
            title: m.continue,
            refetchApplicationAfterSubmit: true,
            placement: 'footer',
            actions: [
              {
                event: 'SUBMIT',
                name: m.continue,
                type: 'primary',
              },
            ],
          }),
        ],
      }),
      buildSection({
        id: 'info',
        title: m.info,
        children: [],
      }),
      buildSection({
        id: 'electionInfo',
        title: m.election,
        condition: (answers, externalData) =>
          getCurrentUserType(answers, externalData) === FSIUSERTYPE.INDIVIDUAL,
        children: [],
      }),
      buildSection({
        id: 'keyNumbers',
        title: m.keyNumbers,
        children: [],
      }),
      buildSection({
        id: 'documents',
        title: m.financialStatement,
        children: [],
      }),
      buildSection({
        id: 'overviewSection',
        title: m.overviewSectionTitle,
        children: [],
      }),
    ],
  })
