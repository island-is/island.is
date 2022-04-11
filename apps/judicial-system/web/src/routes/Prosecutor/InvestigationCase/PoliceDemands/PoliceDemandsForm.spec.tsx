import { formatInstitutionName } from './PoliceDemandsForm'
describe('formatInstitutionName', () => {
  test('should change institution name for police insitituion', () => {
    const institutionName = 'Lögreglustjórinn á höfuðborgarsvæðinu'

    const result = formatInstitutionName(institutionName)

    expect(result).toBe('lögreglustjóranum á höfuðborgarsvæðinu')
  })

  test('should change institution name for other police insitituion', () => {
    const institutionName = 'Lögreglustjórinn á reykjanesi'

    const result = formatInstitutionName(institutionName)

    expect(result).toBe('lögreglustjóranum á reykjanesi')
  })

  test('should change institution name for province prosecutor', () => {
    const institutionName = 'Héraðssaksóknari'

    const result = formatInstitutionName(institutionName)

    expect(result).toBe('héraðssaksóknara')
  })
})
