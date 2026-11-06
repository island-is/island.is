import {
  SDF_FIELD_BLOCK_MARGIN_BOTTOM,
  SDF_FIELD_CONTROL_PADDING_TOP,
} from '../../components/sdfLayoutTokens'

describe('sdfLayoutTokens', () => {
  it('exports control padding aligned with legacy TextFormField inner Box (paddingTop={2})', () => {
    expect(SDF_FIELD_CONTROL_PADDING_TOP).toBe(2)
  })

  it('exports field block margin bottom within a reasonable range (legacy default: 0)', () => {
    expect(SDF_FIELD_BLOCK_MARGIN_BOTTOM).toBeGreaterThanOrEqual(0)
    expect(SDF_FIELD_BLOCK_MARGIN_BOTTOM).toBeLessThanOrEqual(6)
  })
})
