import {
  buildCustomField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { FormItemTypes } from '@island.is/application/types'
import { walkForm, walkFormLeaf } from './form-walker.util'

describe('walkFormLeaf legacy REPEATER', () => {
  it('walks repeater children and namespaces their ids', () => {
    const startDateTitle = {
      id: 'pl.application:startDate.title',
      defaultMessage: 'Start date',
    }
    const firstPeriodTitle = {
      id: 'pl.application:firstPeriod.title',
      defaultMessage: 'First period',
    }

    const screen = walkFormLeaf(
      buildRepeater({
        id: 'periods',
        title: {
          id: 'pl.application:leavePlan.title',
          defaultMessage: 'Leave plan',
        },
        component: 'PeriodsRepeater',
        children: [
          buildCustomField({
            id: 'firstPeriodStart',
            title: firstPeriodTitle,
            component: 'FirstPeriodStart',
          }),
          buildTextField({
            id: 'startDate',
            title: startDateTitle,
          }),
        ],
      }),
    )

    expect(screen.type).toBe(FormItemTypes.REPEATER)
    expect(screen.id).toBe('periods')
    expect(screen.children?.map((child) => child.id)).toEqual([
      'periods::firstPeriodStart',
      'periods::startDate',
    ])
    expect(screen.children?.[0].title).toBe('First period')
    expect(screen.children?.[1].title).toBe('Start date')
    expect(screen.messageDescriptors.map((d) => d.id)).toEqual(
      expect.arrayContaining([
        'pl.application:leavePlan.title',
        'pl.application:firstPeriod.title',
        'pl.application:startDate.title',
      ]),
    )
  })

  it('walks nested MULTI_FIELD children inside a repeater', () => {
    const screen = walkFormLeaf(
      buildRepeater({
        id: 'employers',
        title: {
          id: 'oap.application:employer.title',
          defaultMessage: 'Employers',
        },
        component: 'EmployersOverview',
        children: [
          buildMultiField({
            id: 'addEmployers',
            title: {
              id: 'oap.application:employer.registration',
              defaultMessage: 'Add employer',
            },
            children: [
              buildTextField({
                id: 'email',
                title: {
                  id: 'oap.application:employer.email',
                  defaultMessage: 'Email',
                },
              }),
            ],
          }),
        ],
      }),
    )

    expect(screen.children).toHaveLength(1)
    expect(screen.children?.[0].id).toBe('employers::addEmployers')
    expect(screen.children?.[0].children?.map((child) => child.id)).toEqual([
      'email',
    ])
    expect(screen.messageDescriptors.map((d) => d.id)).toEqual(
      expect.arrayContaining([
        'oap.application:employer.title',
        'oap.application:employer.registration',
        'oap.application:employer.email',
      ]),
    )
  })

  it('yields parental-leave periods child screens when walked as a form section', () => {
    const form = walkForm(
      buildForm({
        id: 'ParentalLeaveForm',
        title: 'Parental leave',
        children: [
          buildSection({
            id: 'leavePeriods',
            title: 'Leave periods',
            children: [
              buildSubSection({
                id: 'addPeriods',
                title: 'Add periods',
                children: [
                  buildRepeater({
                    id: 'periods',
                    title: 'Leave plan',
                    component: 'PeriodsRepeater',
                    children: [
                      buildCustomField({
                        id: 'firstPeriodStart',
                        title: 'First period start',
                        component: 'FirstPeriodStart',
                      }),
                      buildTextField({
                        id: 'startDate',
                        title: 'Start date',
                      }),
                      buildTextField({
                        id: 'useLength',
                        title: 'Duration',
                      }),
                      buildCustomField({
                        id: 'endDate',
                        title: 'Duration',
                        component: 'Duration',
                      }),
                      buildCustomField({
                        id: 'endDate',
                        title: 'End date',
                        component: 'PeriodEndDate',
                      }),
                      buildCustomField({
                        id: 'ratio',
                        title: 'Ratio',
                        component: 'PeriodPercentage',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    )

    const periods = form.sections[0].subSections[0].screens[0]
    expect(periods.id).toBe('periods')
    expect(periods.type).toBe(FormItemTypes.REPEATER)
    expect(periods.children?.map((child) => child.id)).toEqual([
      'periods::firstPeriodStart',
      'periods::startDate',
      'periods::useLength',
      'periods::endDate',
      'periods::endDate',
      'periods::ratio',
    ])
  })
})

describe('walkForm', () => {
  it('wraps root-level FormLeaf children as synthetic sections', () => {
    const form = walkForm(
      buildForm({
        id: 'orphan-root',
        title: 'Orphan root',
        children: [
          buildSection({
            id: 'section',
            title: 'Section',
            children: [
              buildSubSection({
                id: 'sub',
                title: 'Sub',
                children: [
                  buildTextField({
                    id: 'name',
                    title: 'Name',
                  }),
                ],
              }),
            ],
          }),
          buildTextField({
            id: 'rootField',
            title: 'Kept',
          }),
        ],
      }),
    )

    expect(form.sections).toHaveLength(2)
    expect(form.sections[0].id).toBe('section')
    expect(form.sections[1].id).toBe('rootField')
    expect(form.sections[1].screens.map((screen) => screen.id)).toEqual([
      'rootField',
    ])
  })

  it('disambiguates duplicate section ids so each row is independently selectable', () => {
    const form = walkForm(
      buildForm({
        id: 'duplicate-sections',
        title: 'Duplicate sections',
        children: [
          buildSection({
            id: 'cancelationSection',
            title: 'Cancel',
            children: [
              buildTextField({
                id: 'cancelField',
                title: 'Cancel field',
              }),
            ],
          }),
          buildSection({
            id: 'cancelationSection',
            title: 'Warning',
            children: [
              buildTextField({
                id: 'warningField',
                title: 'Warning field',
              }),
            ],
          }),
        ],
      }),
    )

    expect(form.sections.map((section) => section.id)).toEqual([
      'cancelationSection',
      'cancelationSection__1',
    ])
    expect(form.sections[0].screens[0].id).toBe('cancelField')
    expect(form.sections[1].screens[0].id).toBe('warningField')
  })

  it('extracts KEY_VALUE label and value descriptors', () => {
    const screen = walkFormLeaf(
      buildKeyValueField({
        label: {
          id: 'hms.application:key.label',
          defaultMessage: 'Label',
        },
        value: {
          id: 'hms.application:key.value',
          defaultMessage: 'Value',
        },
      }),
    )

    expect(screen.messageDescriptors.map((d) => d.id)).toEqual(
      expect.arrayContaining([
        'hms.application:key.label',
        'hms.application:key.value',
      ]),
    )
  })
})
