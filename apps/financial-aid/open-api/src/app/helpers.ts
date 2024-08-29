import { BadRequestException } from '@nestjs/common'

export const isDateValid = (
  startDate: string,
  dateType: 'endDate' | 'startDate',
): boolean => {
  // Regular expression to match the YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(startDate)) {
    throw new BadRequestException(
      `${dateType} is not formatted correctly, should be year-month-date e.g. 2024-02-22`,
    )
  }

  // Parse the input string into a Date object
  const date = new Date(startDate)
  const isValidDate = date instanceof Date && !Number.isNaN(date.getTime())
  const [year, month, day] = startDate.split('-').map(Number)
  const isCorrectDate =
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day

  if (!isValidDate || !isCorrectDate) {
    throw new BadRequestException(`${dateType} is not valid`)
  }

  // Get the current date without the time portion
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check that the date is not in the future
  const isNotInFuture = date <= today
  if (!isNotInFuture) {
    throw new BadRequestException(`${dateType} cannot be in the future`)
  }

  return true
}
