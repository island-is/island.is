import { useGetPaperMailInfoQuery } from './getPaperMailInfo.query.generated'
import { usePostPaperMailInfoMutation } from './postPaperMailInfo.mutation.generated'

export const usePaperMail = () => {
  const { data, loading } = useGetPaperMailInfoQuery()

  const [postPaperMailMutation, { data: mutationData, loading: postLoading }] =
    usePostPaperMailInfoMutation()

  return {
    postPaperMailMutation,
    wantsPaper:
      mutationData?.postPaperMailInfo?.wantsPaper ??
      data?.getPaperMailInfo?.wantsPaper ??
      null,
    loading,
    postLoading,
  }
}
