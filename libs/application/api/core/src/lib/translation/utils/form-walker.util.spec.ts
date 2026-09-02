import { Logger } from '@nestjs/common'
import {
  buildCustomField,
  buildForm,
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
  it('keeps SECTION children and warns when dropping other root leaves', () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation()

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
            title: 'Dropped',
          }),
        ],
      }),
    )

    expect(form.sections).toHaveLength(1)
    expect(form.sections[0].id).toBe('section')
    expect(warnSpy).toHaveBeenCalledWith(
      'walkForm dropped non-SECTION root child of type "TEXT" on form "orphan-root" / "rootField"',
    )

    warnSpy.mockRestore()
  })
})
