// Tag selector for expandable, sorting table in vaccinations
export const tagSelector = (str: string) => {
  const obj = {
    expired: 'blue',
    vaccinated: 'mint',
    unvaccinated: 'red',
  }

  return (obj as any)?.[str] || 'blue'
}
