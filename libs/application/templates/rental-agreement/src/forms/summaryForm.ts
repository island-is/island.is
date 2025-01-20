import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { Summary } from './summary/summary'
import { SignatureInfo } from './signatureInfo/signatureInfo'
import { Signing } from './signing/signing'

import { application } from '../lib/messages'

export const SummaryForm: Form = buildForm({
  id: 'SummaryForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [Summary, SignatureInfo, Signing],
})
