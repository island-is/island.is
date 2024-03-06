import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import { conclusionSection } from '../utils'
import Logo from '../assets/Logo'

export const InReview: Form = buildForm({
  id: 'GrindavikHousingBuyoutInReview',
  title: m.application.general.name,
  mode: FormModes.IN_PROGRESS,
  logo: Logo,
  children: [conclusionSection],
})
