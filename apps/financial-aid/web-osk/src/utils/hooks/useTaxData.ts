import { useContext } from 'react'

import { GatherTaxDataQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  DirectTaxPayment,
  FileType,
  PersonalTaxReturn,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const useTaxData = () => {
  const gatherTaxDataQuery = useAsyncLazyQuery<{
    municipalitiesPersonalTaxReturn: { personalTaxReturn: PersonalTaxReturn }
    municipalitiesDirectTaxPayments: { directTaxPayments: DirectTaxPayment[] }
  }>(GatherTaxDataQuery)
  const { form, updateForm } = useContext(FormContext)

  const gatherTaxData = async () => {
    const { data: taxes } = await gatherTaxDataQuery({})

    updateForm({
      ...form,
      taxReturnFromRskFile: taxes?.municipalitiesPersonalTaxReturn
        ?.personalTaxReturn
        ? [
            {
              ...taxes.municipalitiesPersonalTaxReturn?.personalTaxReturn,
              type: FileType.TAXRETURN,
            },
          ]
        : [],
      directTaxPayments:
        taxes?.municipalitiesDirectTaxPayments.directTaxPayments,
    })
  }

  return gatherTaxData
}

export default useTaxData
