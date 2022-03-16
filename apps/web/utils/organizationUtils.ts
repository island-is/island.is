export const getOrganizationPageSlugFromPathname = (
  pathname: string,
  fallback = '',
) => {
  // '/s/syslumenn/uppbod' will return 'syslumenn'
  return pathname?.split('/')?.at(-2) ?? fallback
}

export const getOrganizationSubpageSlugFromPathname = (
  pathname: string,
  fallback = '',
) => {
  // '/s/syslumenn/uppbod' will return 'uppbod'
  return pathname?.split('/')?.at(-1) ?? fallback
}
