import { buildSection } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExtraPermissionSubSection } from './ExtraPermission'
import { ExtraDataProviderSubSection } from './ExtraDataProvider'

export const ExtraSection = () =>
  buildSection({
    id: 'ExtraSection',
    title: 'TODO',
    condition: (formValue: FormValue, externalData) => {
      return true //TODO
    },
    children: [ExtraPermissionSubSection, ExtraDataProviderSubSection],
  })
