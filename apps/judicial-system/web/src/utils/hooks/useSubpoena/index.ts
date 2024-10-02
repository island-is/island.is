import { useSubpoenaStatusQuery } from './getSubpoenaStatus.generated'

const useSubpoena = (caseId?: string | null, subpoenaId?: string | null) => {
  const {
    data: subpoenaStatus,
    loading: subpoenaStatusLoading,
    error: subpoenaStatusError,
  } = useSubpoenaStatusQuery({
    variables: {
      input: {
        caseId: '2857102e-d35f-4726-893e-ff19a6f78127', //caseId ?? '',
        subpoenaId: '5cd30560-4a24-4980-b5b4-5150578be755', // subpoenaId ?? '',
      },
    },
  })

  return { subpoenaStatus, subpoenaStatusLoading, subpoenaStatusError }
}

export default useSubpoena
