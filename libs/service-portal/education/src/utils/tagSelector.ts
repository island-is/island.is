export const tagSelector = (str: string) => {
  const obj = {
    finished: 'mint',
    unfinished: 'purple',
    rated: 'blue',
    m: 'blue',
    failed: 'red',
    'Féll á önn': 'red',
  }

  return (obj as any)?.[str] || 'blue'
}
