import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { dataCollection } from './Sections/dataCollection'
import { announcerInfo } from './Sections/announcerInfo'
import { spouseOfTheDeceased } from './Sections/spouseOfTheDeceased'
import { estateMembers } from './Sections/estateMembers'
import { testamentInfo } from './Sections/testamentInfo'
import { estateAssets } from './Sections/estateAssets'
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
    spouseOfTheDeceased,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    overview,
    representative,
    approvePrivateDivisionSubmission,
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
    overview,
    attachments,
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
    overview,
    attachments,
  ],
})

/* OPINBER SKIPTI */

export const officialDivisionForm: Form = buildForm({
  id: 'officialDivisionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataCollection, announcerInfo, overview],
})
