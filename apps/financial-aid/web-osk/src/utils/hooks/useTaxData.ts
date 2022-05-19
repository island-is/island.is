import { useContext } from 'react'

import { GatherTaxDataQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  addUserTypeDirectPayments,
  DirectTaxPayment,
  FileType,
  PersonalTaxReturn,
  useAsyncLazyQuery,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const useTaxData = () => {
  const gatherTaxDataQuery = useAsyncLazyQuery<
    {
      municipalitiesPersonalTaxReturn: { personalTaxReturn: PersonalTaxReturn }
      municipalitiesDirectTaxPayments: {
        directTaxPayments: DirectTaxPayment[]
        success: boolean
      }
    },
    { input: { id: string } }
  >(GatherTaxDataQuery)

  const { form, updateForm } = useContext(FormContext)
  const { user } = useContext(AppContext)

  const gatherTaxData = async () => {
    const { data: taxes } = await gatherTaxDataQuery({
      input: { id: form.fileFolderId },
    })

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
      directTaxPayments: addUserTypeDirectPayments(
        user?.spouse?.hasPartnerApplied ? UserType.SPOUSE : UserType.APPLICANT,
        taxes?.municipalitiesDirectTaxPayments?.directTaxPayments,
      ),
      hasFetchedPayments: taxes?.municipalitiesDirectTaxPayments?.success,
    })
  }

  return gatherTaxData
}

export default useTaxData
