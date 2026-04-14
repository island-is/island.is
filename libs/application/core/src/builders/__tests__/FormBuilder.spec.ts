import { FormBuilder } from '../FormBuilder'
import {
  Comparators,
  FieldTypes,
  Form,
  FormItemTypes,
  MultiField,
  Section,
} from '@island.is/application/types'

describe('FormBuilder', () => {
  it('builds a Form AST identical to buildForm output shape', () => {
    const form = new FormBuilder('draftForm', 'My Application')
      .addSection('info', 'Personal Info', (section) => {
        section.addPage('details', 'Details', (page) => {
          page
            .addTextField('name', 'Full Name')
            .addRadioField('status', 'Marital Status', {
              options: ['single', 'married'],
            })
        })
      })
      .build()

    expect(form.id).toBe('draftForm')
    expect(form.title).toBe('My Application')
    expect(form.type).toBe(FormItemTypes.FORM)
    expect(form.children).toHaveLength(1)

    const section = form.children[0] as Section
    expect(section.id).toBe('info')
    expect(section.title).toBe('Personal Info')
    expect(section.type).toBe(FormItemTypes.SECTION)
    expect(section.children).toHaveLength(1)

    const multiField = section.children[0] as MultiField
    expect(multiField.id).toBe('details')
    expect(multiField.type).toBe(FormItemTypes.MULTI_FIELD)
    expect(multiField.children).toHaveLength(2)

    const textField = multiField.children[0]
    expect(textField.id).toBe('name')
    expect(textField.type).toBe(FieldTypes.TEXT)

    const radioField = multiField.children[1]
    expect(radioField.id).toBe('status')
    expect(radioField.type).toBe(FieldTypes.RADIO)
    expect((radioField as any).options).toEqual([
      { label: 'single', value: 'single' },
      { label: 'married', value: 'married' },
    ])
  })

  it('supports showWhen Tier 1 — simple declarative condition', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage('p', 'P', (page) => {
          page
            .addTextField('hasSpouse', 'Has spouse?')
            .addTextField('spouseName', 'Spouse name', {
              showWhen: { field: 'hasSpouse', equals: 'yes' },
            })
        })
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField
    const spouseField = multiField.children[1]

    expect((spouseField as any).condition).toEqual({
      questionId: 'hasSpouse',
      comparator: Comparators.EQUALS,
      value: 'yes',
    })
  })

  it('supports showWhen Tier 2 — multi-condition (all)', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage('p', 'P', (page) => {
          page.addTextField('dependent', 'Dependent name', {
            showWhen: {
              all: [
                { field: 'hasDependents', equals: 'yes' },
                { field: 'maritalStatus', notEquals: 'single' },
              ],
            },
          })
        })
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField
    const field = multiField.children[0]
    const condition = (field as any).condition

    expect(condition.isMultiCheck).toBe(true)
    expect(condition.show).toBe(true)
    expect(condition.on).toBe('all')
    expect(condition.check).toHaveLength(2)
    expect(condition.check[0]).toEqual({
      questionId: 'hasDependents',
      comparator: Comparators.EQUALS,
      value: 'yes',
    })
    expect(condition.check[1]).toEqual({
      questionId: 'maritalStatus',
      comparator: Comparators.NOT_EQUAL,
      value: 'single',
    })
  })

  it('supports showWhen Tier 3 — closure condition', () => {
    const closureFn = (answers: any) => answers.complex === true

    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage('p', 'P', (page) => {
          page.addTextField('field', 'Field', {
            showWhen: closureFn,
          })
        })
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField
    const field = multiField.children[0]

    expect(typeof (field as any).condition).toBe('function')
    expect((field as any).condition).toBe(closureFn)
  })

  it('supports subsections', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addSubSection('sub', 'Sub', (sub) => {
          sub.addPage('p', 'P', (page) => {
            page.addTextField('name', 'Name')
          })
        })
      })
      .build()

    const section = form.children[0] as Section
    expect(section.children).toHaveLength(1)
    expect(section.children[0].type).toBe(FormItemTypes.SUB_SECTION)
    expect(section.children[0].children).toHaveLength(1)
  })

  it('supports multiple sections', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s1', 'Section 1', (s) => {
        s.addPage('p1', 'Page 1', (p) => p.addTextField('f1', 'Field 1'))
      })
      .addSection('s2', 'Section 2', (s) => {
        s.addPage('p2', 'Page 2', (p) => p.addTextField('f2', 'Field 2'))
      })
      .build()

    expect(form.children).toHaveLength(2)
    expect((form.children[0] as Section).id).toBe('s1')
    expect((form.children[1] as Section).id).toBe('s2')
  })
})
