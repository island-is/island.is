export const checkActiveHeaderLink = (router, link) => {
  return router?.pathname == link ? true : false
}

export default checkActiveHeaderLink
