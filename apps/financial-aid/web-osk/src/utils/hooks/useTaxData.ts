import { useContext } from 'react'

import {
  GatherDirectTaxPaymentsQuery,
  GatherPersonalTaxReturnQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  DirectTaxPayment,
  FileType,
  PersonalTaxReturn,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const useTaxData = () => {
  const gatherDirectTaxPayments = useAsyncLazyQuery<{
    municipalitiesDirectTaxPayments: {
      directTaxPayments: DirectTaxPayment[]
      success: boolean
    }
  }>(GatherDirectTaxPaymentsQuery)

  const gatherTaxReturn = useAsyncLazyQuery<
    {
      municipalitiesPersonalTaxReturn: { personalTaxReturn: PersonalTaxReturn }
    },
    { input: { id: string } }
  >(GatherPersonalTaxReturnQuery)

  const { form, updateForm } = useContext(FormContext)

  const gatherTaxData = async () => {
    const { data: directPayments } = await gatherDirectTaxPayments({})
    const { data: taxReturn } = await gatherTaxReturn({
      input: { id: form.fileFolderId },
    })
    updateForm({
      ...form,
      taxReturnFromRskFile: taxReturn?.municipalitiesPersonalTaxReturn
        ?.personalTaxReturn
        ? [
            {
              ...taxReturn.municipalitiesPersonalTaxReturn?.personalTaxReturn,
              type: FileType.TAXRETURN,
            },
          ]
        : [],
      directTaxPayments:
        directPayments?.municipalitiesDirectTaxPayments?.directTaxPayments,
      hasFetchedPayments:
        directPayments?.municipalitiesDirectTaxPayments?.success,
    })
  }

  return gatherTaxData
}

export default useTaxData
