import { FormSystemField } from '@island.is/api/schema'
import { ApplicantTypesEnum } from '@island.is/form-system/enums'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { ApplicantDisplay } from './ApplicantDisplay'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}))

it.each([false, true, undefined])(
  'respects isPhoneRequired=%s when displaying an applicant phone number',
  (isPhoneRequired) => {
    const item: FormSystemField = {
      id: 'applicant',
      screenId: 'screen',
      name: { is: 'Applicant' },
      isRequired: false,
      fieldSettings: { isPhoneRequired },
      values: [
        { json: { name: 'Applicant Name', phoneNumber: '+3546111111' } },
      ],
    }

    render(<ApplicantDisplay item={item} />)

    expect(screen.getByText('Applicant Name')).toBeTruthy()
    if (isPhoneRequired === false) {
      expect(screen.queryByText('Símanúmer')).toBeNull()
      expect(screen.queryByText('+354 611 1111')).toBeNull()
    } else {
      expect(screen.getByText('Símanúmer')).toBeTruthy()
      expect(screen.getByText('+354 611 1111')).toBeTruthy()
    }
  },
)

it.each(Object.values(ApplicantTypesEnum))(
  'shows only applicable property names in labels-only mode for %s',
  (applicantType) => {
    const hideContactDetails = [
      ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
      ApplicantTypesEnum.LEGAL_ENTITY,
      ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
      ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
    ].includes(applicantType)
    const item: FormSystemField = {
      id: 'applicant',
      screenId: 'screen',
      name: { is: 'Applicant' },
      isRequired: false,
      fieldSettings: { applicantType, isAddressRequired: true },
      values: [
        { json: { name: 'Existing Name', email: 'existing@example.com' } },
      ],
    }
    const { container } = render(<ApplicantDisplay item={item} labelsOnly />)
    const expectedLabels = hideContactDetails
      ? 'KennitalaNafnHeimilisfangPóstnúmer'
      : 'KennitalaNafnNetfangSímanúmerHeimilisfangPóstnúmer'
    expect(container.textContent).toBe(expectedLabels)
  },
)

it('shows property names without any values while respecting disabled phone and address settings', () => {
  const item: FormSystemField = {
    id: 'applicant',
    screenId: 'screen',
    name: { is: 'Applicant' },
    isRequired: false,
    fieldSettings: { isPhoneRequired: false, isAddressRequired: false },
    values: [],
  }
  const { container } = render(<ApplicantDisplay item={item} labelsOnly />)
  expect(container.textContent).toBe('KennitalaNafnNetfang')
})

it.each(Object.values(ApplicantTypesEnum))(
  'displays contact details only for supported applicant type %s',
  (applicantType) => {
    const hideContactDetails = [
      ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
      ApplicantTypesEnum.LEGAL_ENTITY,
      ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
      ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
    ].includes(applicantType)
    const item: FormSystemField = {
      id: 'applicant',
      screenId: 'screen',
      name: { is: 'Applicant' },
      isRequired: false,
      fieldSettings: {
        applicantType,
        isPhoneRequired: true,
        isAddressRequired: true,
      },
      values: [
        {
          json: {
            name: 'Applicant Name',
            email: 'applicant@example.com',
            phoneNumber: '+3546111111',
            address: 'Applicant Address',
          },
        },
      ],
    }

    render(<ApplicantDisplay item={item} />)

    expect(screen.getByText('Applicant Name')).toBeTruthy()
    expect(screen.getByText('Applicant Address')).toBeTruthy()
    if (hideContactDetails) {
      expect(screen.queryByText('Netfang')).toBeNull()
      expect(screen.queryByText('applicant@example.com')).toBeNull()
      expect(screen.queryByText('Símanúmer')).toBeNull()
      expect(screen.queryByText('+354 611 1111')).toBeNull()
    } else {
      expect(screen.getByText('Netfang')).toBeTruthy()
      expect(screen.getByText('applicant@example.com')).toBeTruthy()
      expect(screen.getByText('Símanúmer')).toBeTruthy()
      expect(screen.getByText('+354 611 1111')).toBeTruthy()
    }
  },
)
