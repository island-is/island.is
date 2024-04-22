export const formatCurrency = (
  answer: number | null | undefined,
  suffix = ' kr.',
) => {
  if (typeof answer !== 'number') return answer
  return (
    String(Math.floor(answer)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suffix
  )
}
