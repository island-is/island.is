export const getOrganizationPageSlugFromPathname = (
  pathname: string,
  locale = 'is',
  fallback = '',
) => {
  // '/s/syslumenn/uppbod' will return 'syslumenn'
  return pathname.split('/')?.[locale !== 'is' ? 3 : 2] ?? fallback
}

export const getOrganizationSubpageSlugFromPathname = (
  pathname: string,
  locale = 'is',
  fallback = '',
) => {
  // '/s/syslumenn/uppbod' will return 'uppbod'
  return pathname.split('/')?.[locale !== 'is' ? 4 : 3] ?? fallback
}
