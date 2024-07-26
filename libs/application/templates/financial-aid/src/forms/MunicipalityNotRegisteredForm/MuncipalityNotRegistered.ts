import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildLinkField,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form } from '@island.is/application/types'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const MuncipalityNotRegistered: Form = buildForm({
  id: 'FinancialAidApplication',
  title: '',
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildMultiField({
      id: Routes.SERVICECENTER,
      title: m.serviceCenter.general.pageTitle,
      description: m.serviceCenter.general.description, // TODO add variable
      children: [
        buildDescriptionField({
          id: `${Routes.SERVICECENTER}-description`,
          title: '',
          description: m.serviceCenter.general.notRegistered,
        }),
        buildLinkField({
          id: `${Routes.SERVICECENTER}-link`,
          title: m.serviceCenter.general.linkToServiceCenter, // TODO add variable
          iconProps: { icon: 'open' },
        }),
      ],
    }),
  ],
})
