import { SDF_FIELD_BLOCK_MARGIN_BOTTOM } from '../../components/sdfLayoutTokens'

describe('sdfLayoutTokens', () => {
  it('exports a positive spacing token for field blocks', () => {
    expect(SDF_FIELD_BLOCK_MARGIN_BOTTOM).toBeGreaterThanOrEqual(2)
    expect(SDF_FIELD_BLOCK_MARGIN_BOTTOM).toBeLessThanOrEqual(6)
  })
})
