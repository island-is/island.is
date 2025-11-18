import { InvoiceItem } from '../models/invoiceItem.model'

const MOCK_ITEM_LABELS = [
  '[MOCK] Office Supplies - Lorem Ipsum',
  '[MOCK] Consulting Services - Fake Data',
  '[MOCK] Administrative Fees - Test Item',
  '[MOCK] Software License - Dummy Entry',
  '[MOCK] Travel Expenses - Placeholder',
  '[MOCK] Equipment Rental - Sample Data',
  '[MOCK] Training Materials - Mock Content',
  '[MOCK] Maintenance Services - Test Record',
]

export const generateMockItemization = (
  invoiceId: number,
  totalAmount: number,
): InvoiceItem[] => {
  const numItems = Math.floor(Math.random() * 3) + 2 // 2-4 items
  const selectedItems = MOCK_ITEM_LABELS.sort(() => 0.5 - Math.random()).slice(
    0,
    numItems,
  )

  // Generate random percentages that add up to 100%
  const percentages = Array(numItems)
    .fill(0)
    .map(() => Math.random())
  const total = percentages.reduce((sum, p) => sum + p, 0)
  const normalizedPercentages = percentages.map((p) => p / total)

  let remainingAmount = totalAmount
  const itemization = selectedItems.map((label, index) => {
    const isLast = index === selectedItems.length - 1
    const amount = isLast
      ? remainingAmount
      : Math.round(totalAmount * normalizedPercentages[index])
    remainingAmount -= amount

    return {
      id: `${invoiceId}-mock-item-${index + 1}`,
      label,
      amount,
    }
  })

  return itemization
}
