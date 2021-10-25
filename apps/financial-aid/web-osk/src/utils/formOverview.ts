import {
  getFamilyStatus,
  FamilyStatus,
  HomeCircumstances,
  getHomeCircumstances,
  getEmploymentStatus,
  Employment,
} from '@island.is/financial-aid/shared/lib'
import { useContext } from 'react'
import { FormContext } from '../components/FormProvider/FormProvider'

const formOverview = (isSpouse?: boolean) => {
  const { form } = useContext(FormContext)

  if (isSpouse) {
    return [
      {
        id: 'hasIncome',
        label: 'Tekjur',
        url: 'tekjur',
        info:
          form?.hasIncome === undefined
            ? undefined
            : 'Ég hef ' +
              (form?.hasIncome ? '' : 'ekki') +
              'fengið tekjur í þessum mánuði eða síðasta',
      },
      {
        id: 'emailAddress',
        label: 'Netfang',
        url: 'samskipti',
        info: form?.emailAddress,
      },
    ]
  }
  return [
    {
      id: 'familyStatus',
      label: 'Hjúskaparstaða',
      url: 'hjuskaparstada',
      info: getFamilyStatus[form?.familyStatus as FamilyStatus],
    },
    {
      id: 'homeCircumstances',
      label: 'Búseta',
      url: 'buseta',
      info:
        form?.homeCircumstances === HomeCircumstances.OTHER
          ? form?.homeCircumstancesCustom
          : getHomeCircumstances[form?.homeCircumstances as HomeCircumstances],
    },
    {
      id: 'hasIncome',
      label: 'Tekjur',
      url: 'tekjur',
      info:
        form?.hasIncome === undefined
          ? undefined
          : 'Ég hef ' +
            (form?.hasIncome ? '' : 'ekki') +
            'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      id: 'employmentCustom',
      label: 'Staða',
      url: 'atvinna',
      info: form?.employmentCustom
        ? form?.employmentCustom
        : getEmploymentStatus[form?.employment as Employment],
    },
    {
      id: 'emailAddress',
      label: 'Netfang',
      url: 'samskipti',
      info: form?.emailAddress,
    },
  ]
}

export default formOverview
