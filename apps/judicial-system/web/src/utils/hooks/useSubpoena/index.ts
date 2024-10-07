import { useSubpoenaStatusQuery } from './getSubpoenaStatus.generated'

const useSubpoena = (caseId?: string | null, subpoenaId?: string | null) => {
  const {
    data: subpoenaStatus,
    loading: subpoenaStatusLoading,
    error: subpoenaStatusError,
  } = useSubpoenaStatusQuery({
    variables: {
      input: {
        caseId: caseId ?? '',
        subpoenaId: subpoenaId ?? '',
      },
    },
  })

  return { subpoenaStatus, subpoenaStatusLoading, subpoenaStatusError }
}

export default useSubpoena
