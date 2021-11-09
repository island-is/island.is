import { useContext } from 'react'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

import { Routes } from '@island.is/financial-aid/shared/lib'

export interface FormStepperSection {
  name: string
  type?: string
  url?: string
  children?: FormStepperSection[]
}

const useNavigationTree = (hasIncome: boolean) => {
  const { user } = useContext(AppContext)

  const section: FormStepperSection[] = [
    {
      name: 'Gagnaöflun',
      url: Routes.application,
    },
    {
      name: 'Upplýsingar',
      url: Routes.form.info,
    },
    {
      name: 'Persónuhagir',
      children: [
        {
          type: 'SUB_SECTION',
          name: 'Hjúskaparstaða',
          url: Routes.form.relationship,
        },
        {
          type: 'SUB_SECTION',
          name: 'Búseta',
          url: Routes.form.homeCircumstances,
        },
        { type: 'SUB_SECTION', name: 'Nám', url: Routes.form.student },
        { type: 'SUB_SECTION', name: 'Atvinna', url: Routes.form.employment },
      ],
    },
    {
      name: 'Fjármál',
      children: hasIncome
        ? [
            { type: 'SUB_SECTION', name: 'Tekjur', url: Routes.form.hasIncome },
            { type: 'SUB_SECTION', name: 'Gögn', url: Routes.form.incomeFiles },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: Routes.form.taxReturnFiles,
            },
            {
              type: 'SUB_SECTION',
              name: 'Persónuafsláttur',
              url: Routes.form.usePersonalTaxCredit,
            },
            {
              type: 'SUB_SECTION',
              name: 'Bankaupplýsingar',
              url: Routes.form.bankInfo,
            },
          ]
        : [
            { type: 'SUB_SECTION', name: 'Tekjur', url: Routes.form.hasIncome },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: Routes.form.taxReturnFiles,
            },
            {
              type: 'SUB_SECTION',
              name: 'Persónuafsláttur',
              url: Routes.form.usePersonalTaxCredit,
            },
            {
              type: 'SUB_SECTION',
              name: 'Bankaupplýsingar',
              url: Routes.form.bankInfo,
            },
          ],
    },
    {
      name: 'Samskipti',
      url: Routes.form.contactInfo,
    },
    {
      name: 'Yfirlit',
      url: Routes.form.summary,
    },
    {
      name: 'Staðfesting',
      url: Routes.form.conformation,
    },
  ]

  const spouseSection: FormStepperSection[] = [
    {
      name: 'Upplýsingar',
      url: Routes.form.info,
    },
    {
      name: 'Fjármál',
      children: hasIncome
        ? [
            { type: 'SUB_SECTION', name: 'Tekjur', url: Routes.form.hasIncome },
            { type: 'SUB_SECTION', name: 'Gögn', url: Routes.form.incomeFiles },
            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: Routes.form.taxReturnFiles,
            },
          ]
        : [
            { type: 'SUB_SECTION', name: 'Tekjur', url: Routes.form.hasIncome },

            {
              type: 'SUB_SECTION',
              name: 'Skattagögn',
              url: Routes.form.taxReturnFiles,
            },
          ],
    },
    {
      name: 'Samskipti',
      url: Routes.form.contactInfo,
    },
    {
      name: 'Yfirlit',
      url: Routes.form.spouseSummary,
    },
    {
      name: 'Staðfesting',
      url: Routes.form.conformation,
    },
  ]

  return user?.spouse?.hasPartnerApplied ? spouseSection : section
}

export default useNavigationTree
