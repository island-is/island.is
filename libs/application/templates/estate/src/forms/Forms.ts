import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { dataCollection } from './Sections/dataCollection'
import { announcerInfo } from './Sections/announcerInfo'
import { deceasedSpouse } from './Sections/SpouseOfTheDeceased'
import { estateMembers } from './Sections/estateMembers'
import { testamentInfo } from './Sections/testamentInfo'
import { estateAssets } from './Sections/estateProperties'
import { estateDebts } from './Sections/estateDebts'
import { attachments } from './Sections/attachments'
import { representative } from './Sections/representative'
import { approvePrivateDivisionSubmission } from './Sections/approveSubmission'
import { overview } from './Overviews'
import { estateWithoutAssets } from './Sections/estateWithoutAssets'

/* EINKASKIPTI */

export const privateDivisionForm: Form = buildForm({
  id: 'privateDivisionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    deceasedSpouse,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    representative,
    approvePrivateDivisionSubmission,
    overview,
  ],
})

/* SETA Í ÓSKIPTU BÚI */

export const undividedEstateForm: Form = buildForm({
  id: 'undividedEstateForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

/* EIGNALAUST DÁNARBU */

export const estateWithoutAssetsForm: Form = buildForm({
  id: 'estateWithoutAssetsForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    estateMembers,
    testamentInfo,
    estateWithoutAssets,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

export const officialDivisionForm: Form = buildForm({
  id: 'officialDivisionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataCollection, announcerInfo, overview],
})
