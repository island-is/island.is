import { ChangeEvent } from 'react'

export const removeCurrencyFormatting = (value: string): string => {
  return value.replace(/\D/g, '')
}

export const addCurrencyFormatting = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
): string => {
  const inputValue = e.target.value.replace(/\D/g, '')
  const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return formattedValue
}

export const getSumFromArray = (arr: string[]): string => {
  const cleanedNumbers = arr
    .filter((num) => num !== '')
    .map((num) => parseFloat(removeCurrencyFormatting(num)))
  const totalSum = cleanedNumbers
    .reduce((acc, curr) => acc + curr, 0)
    .toString()
  return totalSum.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
