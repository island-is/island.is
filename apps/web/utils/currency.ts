export const formatCurrency = (
  answer: number | null | undefined,
  suffix = ' kr.',
  numericFunction = Math.floor,
) => {
  if (typeof answer !== 'number') return answer
  return (
    String(numericFunction(answer)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
    suffix
  )
}
