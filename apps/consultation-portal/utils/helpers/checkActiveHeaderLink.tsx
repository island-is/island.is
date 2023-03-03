import { useRouter } from 'next/router'

const checkActiveHeaderLink = (link: string) => {
  const router = useRouter()
  return router.pathname == link ? true : false
}

export default checkActiveHeaderLink
