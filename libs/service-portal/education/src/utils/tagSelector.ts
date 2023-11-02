export const tagSelector = (str: string) => {
  const obj = {
    Lokið: 'mint',
    Ólokið: 'purple',
    Metið: 'blue',
    M: 'blue',
    Féll: 'red',
    'Féll á önn': 'red',
  }

  return (obj as any)?.[str] || 'blue'
}
