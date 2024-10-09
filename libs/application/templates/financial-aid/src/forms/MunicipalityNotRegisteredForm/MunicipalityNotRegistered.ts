import {
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
import { getApplicantsServiceCenter } from '../../lib/utils/getApplicantsServiceCenter'

export const MunicipalityNotRegistered: Form = buildForm({
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
      description: (application) => {
        const applicantsServiceCenter = getApplicantsServiceCenter(application)
        return {
          ...m.serviceCenter.general.description,
          values: { applicantsServiceCenter: applicantsServiceCenter?.name },
        }
      },
      children: [
        buildDescriptionField({
          id: `${Routes.SERVICECENTER}-description`,
          title: '',
          description: m.serviceCenter.general.notRegistered,
        }),
        buildLinkField({
          id: `${Routes.SERVICECENTER}-link`,
          title: (application) => {
            const applicantsServiceCenter =
              getApplicantsServiceCenter(application)
            return {
              ...m.serviceCenter.general.linkToServiceCenter,
              values: {
                applicantsServiceCenter: applicantsServiceCenter?.name,
              },
            }
          },
          iconProps: { icon: 'open' },
          link: (application) => {
            const applicantsServiceCenter =
              getApplicantsServiceCenter(application)

            return applicantsServiceCenter?.link
          },
        }),
      ],
    }),
  ],
})
