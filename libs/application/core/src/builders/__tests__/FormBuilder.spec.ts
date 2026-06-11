import { FormBuilder } from '../FormBuilder'
import { expr } from '../../lib/formExpressionHelper'
import { serverExpr } from '../../lib/serverExpressionHelper'
import {
  Comparators,
  DefaultEvents,
  ExternalDataProvider,
  FieldComponents,
  FieldTypes,
  FormModes,
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
    expect((radioField as { options?: unknown }).options).toEqual([
      { label: 'single', value: 'single' },
      { label: 'married', value: 'married' },
    ])
  })

  it('stores server showWhen as an internal condition on fields', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage('p', 'P', (page) => {
          page
            .addTextField('hasSpouse', 'Has spouse?')
            .addTextField('spouseName', 'Spouse name', {
              showWhen: serverExpr.equals(serverExpr.answer('hasSpouse'), 'yes'),
            })
        })
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField
    const spouseField = multiField.children[1]

    expect((spouseField as { condition?: unknown }).condition).toEqual({
      questionId: 'hasSpouse',
      comparator: Comparators.EQUALS,
      value: 'yes',
    })
  })

  it('stores clientShowWhen AST on radio and checkbox fields', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage('p', 'P', (page) => {
          page
            .addRadioField('dependentRadio', 'Dependent radio', {
              options: ['yes', 'no'],
              clientShowWhen: expr.equals(expr.get('hasDependents'), 'yes'),
            })
            .addCheckboxField('dependentCheckbox', 'Dependent checkbox', {
              options: ['child'],
              clientShowWhen: expr.or(
                expr.equals(expr.get('maritalStatus'), 'married'),
                expr.equals(expr.get('maritalStatus'), 'cohabiting'),
              ),
            })
        })
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField
    const radio = multiField.children[0]
    const checkbox = multiField.children[1]

    expect((radio as { clientShowWhen?: unknown }).clientShowWhen).toEqual({
      operator: 'EQUALS',
      args: [{ operator: 'GET', args: ['hasDependents'] }, 'yes'],
    })

    expect((checkbox as { clientShowWhen?: unknown }).clientShowWhen).toEqual({
      operator: 'OR',
      args: [
        {
          operator: 'EQUALS',
          args: [{ operator: 'GET', args: ['maritalStatus'] }, 'married'],
        },
        {
          operator: 'EQUALS',
          args: [{ operator: 'GET', args: ['maritalStatus'] }, 'cohabiting'],
        },
      ],
    })
  })

  it('stores server showWhen as an internal condition on pages', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addPage(
          'p',
          'P',
          (page) => {
            page.addTextField('field', 'Field')
          },
          { showWhen: serverExpr.equals(serverExpr.answer('gate'), 'open') },
        )
      })
      .build()

    const section = form.children[0] as Section
    const multiField = section.children[0] as MultiField

    expect((multiField as { condition?: unknown }).condition).toEqual({
      questionId: 'gate',
      comparator: Comparators.EQUALS,
      value: 'open',
    })
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

  it('supports form and section options', () => {
    const form = new FormBuilder('f', 'F', {
      mode: FormModes.NOT_STARTED,
      renderLastScreenButton: true,
    })
      .addSection('s', 'S', () => undefined, { tabTitle: 'Tab' })
      .build()

    expect(form.mode).toBe(FormModes.NOT_STARTED)
    expect(form.renderLastScreenButton).toBe(true)
    expect((form.children[0] as Section).tabTitle).toBe('Tab')
  })

  it('supports external data providers', () => {
    const form = new FormBuilder('f', 'F')
      .addSection('s', 'S', (section) => {
        section.addExternalDataProvider('approveExternalData', 'Data collection', {
          checkboxLabel: 'I approve',
          dataProviders: [
            {
              provider: {
                action: 'searchAddresses',
                actionId: 'searchAddresses',
                externalDataId: 'searchAddresses',
                order: 1,
              },
              title: 'Property information',
              subTitle: 'Information from HMS.',
            },
          ],
          submitField: {
            id: 'submit',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: 'Next',
                type: 'primary',
              },
            ],
          },
        })
      })
      .build()

    const section = form.children[0] as Section
    const externalDataProvider = section.children[0] as ExternalDataProvider

    expect(externalDataProvider.type).toBe(FormItemTypes.EXTERNAL_DATA_PROVIDER)
    expect(externalDataProvider.checkboxLabel).toBe('I approve')
    expect(externalDataProvider.dataProviders).toEqual([
      {
        id: 'searchAddresses',
        action: 'searchAddresses',
        order: 1,
        title: 'Property information',
        subTitle: 'Information from HMS.',
      },
    ])
    expect(externalDataProvider.submitField).toMatchObject({
      id: 'submit',
      placement: 'footer',
      refetchApplicationAfterSubmit: true,
      renderLongErrors: false,
      type: FieldTypes.SUBMIT,
      component: FieldComponents.SUBMIT,
    })
  })
})
