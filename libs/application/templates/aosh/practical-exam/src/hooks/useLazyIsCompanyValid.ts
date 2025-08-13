import { IS_COMPANY_VALID_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { CompanyDto } from '@island.is/clients/practical-exams-ver'

export const useLazyIsCompanyValid = () => {
  return useLazyQuery<
    {
      practicalExamIsCompanyValid: CompanyDto
    },
    {
      nationalId: string
    }
  >(IS_COMPANY_VALID_QUERY)
}
