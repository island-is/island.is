import dynamic from 'next/dynamic'

export default dynamic(
  () => import('../../components/lists/ListPageEditor/ListPageEditor'),
  {
    ssr: false,
  },
)
