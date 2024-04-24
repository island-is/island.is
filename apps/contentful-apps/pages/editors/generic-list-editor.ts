import dynamic from 'next/dynamic'

export default dynamic(
  () => import('../../components/lists/GenericListEditor/GenericListEditor'),
  {
    ssr: false,
  },
)
