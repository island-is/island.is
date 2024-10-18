import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import { homeCircumstancesForm } from '../messages'

export const getHomeCircumstancesOptions = () => {
  const options = [
    {
      value: HomeCircumstances.OWNPLACE,
      label: homeCircumstancesForm.circumstances.ownPlace,
    },
    {
      value: HomeCircumstances.REGISTEREDLEASE,
      label: homeCircumstancesForm.circumstances.registeredLease,
    },
    {
      value: HomeCircumstances.UNREGISTEREDLEASE,
      label: homeCircumstancesForm.circumstances.unregisteredLease,
    },

    {
      value: HomeCircumstances.WITHOTHERS,
      label: homeCircumstancesForm.circumstances.withOthers,
    },
    {
      value: HomeCircumstances.WITHPARENTS,
      label: homeCircumstancesForm.circumstances.withParents,
    },
    {
      value: HomeCircumstances.OTHER,
      label: homeCircumstancesForm.circumstances.other,
    },
  ]

  return options
}
