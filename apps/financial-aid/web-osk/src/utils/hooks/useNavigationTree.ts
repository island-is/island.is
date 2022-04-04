import { useContext } from 'react'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

import { Routes } from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

export interface FormStepperSection {
  name: string
  type?: string
  url?: string
  children?: FormStepperSection[]
  isVisible: boolean
}

const useNavigationTree = () => {
  const { user } = useContext(AppContext)
  const { form } = useContext(FormContext)

  const hasIncome = Boolean(form?.hasIncome)
  const showTax = Boolean(
    form?.taxReturnFromRskFile.length === 0 ||
      (form?.directTaxPayments.length === 0 &&
        !form.hasDirectTaxPaymentsSuccess),
  )

  const section: FormStepperSection[] = [
    {
      name: 'Gagnaöflun',
      url: Routes.application,
      isVisible: true,
    },
    {
      name: 'Upplýsingar',
      url: Routes.form.info,
      isVisible: true,
    },
    {
      name: 'Persónuhagir',
      isVisible: true,
      children: [
        {
          type: 'SUB_SECTION',
          name: 'Hjúskaparstaða',
          url: Routes.form.relationship,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Búseta',
          url: Routes.form.homeCircumstances,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Nám',
          url: Routes.form.student,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Staða',
          url: Routes.form.employment,
          isVisible: true,
        },
      ],
    },
    {
      name: 'Fjármál',
      isVisible: true,
      children: [
        {
          type: 'SUB_SECTION',
          name: 'Tekjur',
          url: Routes.form.hasIncome,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Gögn',
          url: Routes.form.incomeFiles,
          isVisible: hasIncome,
        },
        {
          type: 'SUB_SECTION',
          name: 'Skattagögn',
          url: Routes.form.taxReturnFiles,
          isVisible: showTax,
        },
        {
          type: 'SUB_SECTION',
          name: 'Persónuafsláttur',
          url: Routes.form.usePersonalTaxCredit,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Bankaupplýsingar',
          url: Routes.form.bankInfo,
          isVisible: true,
        },
      ],
    },
    {
      name: 'Samskipti',
      url: Routes.form.contactInfo,
      isVisible: true,
    },
    {
      name: 'Yfirlit',
      url: Routes.form.summary,
      isVisible: true,
    },
    {
      name: 'Staðfesting',
      url: Routes.form.conformation,
      isVisible: true,
    },
  ]

  const spouseSection: FormStepperSection[] = [
    {
      name: 'Gagnaöflun',
      url: Routes.application,
      isVisible: true,
    },
    {
      name: 'Upplýsingar',
      url: Routes.form.info,
      isVisible: true,
    },
    {
      name: 'Fjármál',
      isVisible: true,
      children: [
        {
          type: 'SUB_SECTION',
          name: 'Tekjur',
          url: Routes.form.hasIncome,
          isVisible: true,
        },
        {
          type: 'SUB_SECTION',
          name: 'Gögn',
          url: Routes.form.incomeFiles,
          isVisible: hasIncome,
        },
        {
          isVisible: showTax,
          type: 'SUB_SECTION',
          name: 'Skattagögn',
          url: Routes.form.taxReturnFiles,
        },
      ],
    },
    {
      name: 'Samskipti',
      url: Routes.form.contactInfo,
      isVisible: true,
    },
    {
      name: 'Yfirlit',
      url: Routes.form.spouseSummary,
      isVisible: true,
    },
    {
      name: 'Staðfesting',
      url: Routes.form.conformation,
      isVisible: true,
    },
  ]

  return user?.spouse?.hasPartnerApplied
    ? filterVisible(spouseSection)
    : filterVisible(section)
}

const filterVisible = (sections: FormStepperSection[]) => {
  return sections
    .filter((s) => s.isVisible)
    .map((s) => {
      if (s.children) {
        s.children = s.children?.filter((c) => c.isVisible)
      }
      return s
    })
}

export default useNavigationTree
