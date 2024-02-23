export const formatCurrency = (answer: number | null | undefined) => {
  if (typeof answer !== 'number') return answer
  return String(answer).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}
