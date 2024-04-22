import dynamic from 'next/dynamic'

export default dynamic(() => import('../../components/ListPageEditor'), {
  ssr: false,
})
