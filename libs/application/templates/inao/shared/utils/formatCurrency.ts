export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
