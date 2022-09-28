import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../components'
import { m } from '../../lib/messages'
import { fakeDataSection } from './fakeDataSection'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'FinancialStatementInaoPrerequisitesForm',
    title: m.institutionName,
    logo: Logo,
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'fakedata',
        title: 'Gervigögn',
        children: [...(allowFakeData ? [fakeDataSection] : [])],
      }),
      buildSection({
        id: 'info',
        title: m.about,
        children: [],
      }),
      buildSection({
        id: 'keynumbers',
        title: m.keyNumbers,
        children: [],
      }),
      buildSection({
        id: 'upload',
        title: m.financialStatement,
        children: [],
      }),
      buildSection({
        id: 'overview',
        title: m.overview,
        children: [],
      }),
    ],
  })
}
