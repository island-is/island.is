import * as fs from 'fs'
import * as path from 'path'

/**
 * Structure-level guards for the two renderer cases we just rewrote to match
 * the legacy CheckboxFormField / DisplayFormField visuals. A full RTL render
 * requires the vanilla-extract pipeline and island-ui tree-shaking; these
 * source-text assertions lock in the parity-critical primitives without that
 * overhead and follow the same pattern as `formRendererFieldContract.spec.ts`.
 */
describe('FormRenderer — Checkbox & DisplayField parity structure', () => {
  const checkboxFieldPath = path.join(
    __dirname,
    '../../components/form-renderer/fields/SdfCheckboxField.tsx',
  )
  const displayFieldPath = path.join(
    __dirname,
    '../../components/form-renderer/fields/SdfDisplayField.tsx',
  )
  const checkboxBlock = fs.readFileSync(checkboxFieldPath, 'utf8')
  const displayBlock = fs.readFileSync(displayFieldPath, 'utf8')

  describe('SdfCheckboxField case', () => {
    const block = checkboxBlock

    it('splits width=HALF into 1/2 columns and full width into 1/1 columns', () => {
      expect(block).toMatch(/component\.width === 'HALF'[^]*?'1\/2'[^]*?'1\/1'/)
    })

    it('renders the label as a Text h4 with a red asterisk when required', () => {
      expect(block).toContain('variant="h4"')
      expect(block).toContain('color="red600"')
      expect(block).toMatch(/\*/)
    })

    it('renders the description via FieldDescription (shared form-fields)', () => {
      expect(block).toContain('<FieldDescription')
      expect(block).toContain('component.description')
    })

    it('lays out options in a GridRow of GridColumn span={[\'1/1\', split]} with paddingBottom spacing', () => {
      expect(block).toContain('<GridRow>')
      expect(block).toContain("span={['1/1', split]}")
      expect(block).toContain('paddingBottom={spacing}')
    })

    it('passes large/strong/backgroundColor/hasError through to each Checkbox option', () => {
      expect(block).toContain('large={component.large}')
      expect(block).toContain('strong={component.strong}')
      expect(block).toContain('backgroundColor={checkboxBg}')
      expect(block).toContain('hasError={!!error}')
    })

    it('renders a single InputError row at the bottom of the grid when there is an error', () => {
      expect(block).toContain('<InputError')
      expect(block).toContain('errorMessage={error}')
    })

    it('keeps the array-based toggle semantics for multi-select', () => {
      expect(block).toMatch(/\[\s*\.\.\.currentArray\s*,\s*opt\.value\s*\]/)
      expect(block).toMatch(/currentArray\.filter\(\(v\) => v !== opt\.value\)/)
    })
  })

  describe('SdfDisplayField case', () => {
    const block = displayBlock

    it('picks the title variant from component.titleVariant, defaulting to h4', () => {
      expect(block).toContain('component.titleVariant')
      expect(block).toMatch(/:\s*'h4'/)
    })

    it('overlays displayValues[component.id] before falling back to stored or static value', () => {
      expect(block).toMatch(/displayValues\s*\[\s*component\.id\s*\]/)
      expect(block).toMatch(/overlayValue\s*\?\?/)
      expect(block).toMatch(/component\.displayValue\s*\?\?/)
    })

    it('evaluates clientExpression before backend overlay or static value', () => {
      expect(block).toContain('evaluateClientDisplayExpression')
      expect(block).toMatch(/clientExpressionValue\s*\?\?/)
      expect(block).toMatch(/clientExpressionValue\s*\?\?[^]*overlayValue\s*\?\?/)
    })

    it('wraps currency/number variants in NumberFormat with Input as the custom input', () => {
      expect(block).toContain('<NumberFormat')
      expect(block).toContain('key={String(rawValue)}')
      expect(block).toContain('isNumericString')
      expect(block).toContain('customInput={Input}')
      expect(block).toContain("inputVariant === 'currency'")
      expect(block).toContain("inputVariant === 'number'")
    })

    it('renders a readOnly blue-background Input with the inline displayInputLabel', () => {
      expect(block).toContain('readOnly: true')
      expect(block).toContain("backgroundColor: 'blue'")
      expect(block).toContain('displayInputLabel')
    })

    it('uses shared SDF input spacing tokens instead of standalone display spacing', () => {
      expect(block).toContain('SDF_FIELD_BLOCK_MARGIN_BOTTOM')
      expect(block).toContain('SDF_FIELD_CONTROL_PADDING_TOP')
      expect(block).toContain('marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}')
      expect(block).toContain('paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}')
    })

    it('aligns halfWidthOwnline to the right half via flexEnd + width=half + paddingLeft', () => {
      expect(block).toContain('halfWidthOwnline')
      expect(block).toContain(
        "alignItems={component.halfWidthOwnline ? 'flexEnd' : undefined}",
      )
      expect(block).toMatch(/width=\{component\.halfWidthOwnline \? 'half' : 'full'\}/)
    })

    it('passes rightAlign through to the Input', () => {
      expect(block).toContain('rightAlign: component.rightAlign === true')
    })

    it('defaults currency suffix to " kr." when not overridden by textSuffix', () => {
      expect(block).toMatch(/component\.textSuffix/)
      expect(block).toContain("' kr.'")
    })
  })
})
