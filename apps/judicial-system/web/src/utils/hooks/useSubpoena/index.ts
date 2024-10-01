import { useSubpoenaStatusQuery } from './getSubpoenaStatus.generated'

const useSubpoena = () => {
  const { data: subpoenaStatus } = useSubpoenaStatusQuery({
    variables: {
      input: {
        caseId: '8aee2f76-69cb-4336-9ce7-96e33a6c321b',
        subpoenaId: '5cd30560-4a24-4980-b5b4-5150578be755',
      },
    },
  })

  return { subpoenaStatus }
}

export default useSubpoena
