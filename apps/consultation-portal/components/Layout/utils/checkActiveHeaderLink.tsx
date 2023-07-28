import { NextRouter } from 'next/router'

interface Props {
  router: NextRouter
  link: string
}

const checkActiveHeaderLink = ({ router, link }: Props) => {
  return router?.pathname == link ? true : false
}

export default checkActiveHeaderLink
