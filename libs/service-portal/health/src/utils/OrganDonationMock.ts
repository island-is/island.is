import { Locale } from '@island.is/shared/types'

interface Data {
  title: string
  description: string
  limitations?: string[]
}

interface OrganDonor {
  data: Data
}

export interface OptionsLimitations {
  value: string
  type: string
}
export interface OptionsOptions {
  id: string
  title: string
  limitations?: Array<OptionsLimitations>
}

interface OptionsData {
  options: OptionsOptions[]
}

interface Options {
  data: OptionsData
}

export const getOrganDonor = (locale: Locale) => {
  const dataIS: OrganDonor = {
    data: {
      title: 'Ég er líffæragjafi',
      description: 'Öll mín líffæri má nota til ígræðslu.',
      limitations: undefined,
    },
  }
  const dataEN: OrganDonor = {
    data: {
      title: 'I am an organ donor',
      description: 'All my organs can be used for transplantation',
      limitations: undefined,
    },
  }
  return {
    data: locale === 'en' ? dataEN : dataIS,
    loading: false,
    error: false,
  }
}

export const getOptions = (locale: Locale) => {
  const dataIS: Options = {
    data: {
      options: [
        {
          id: '1',
          title:
            'Við andlát mitt er heimilt að nota líffærin mín til ígræðslu.',
        },
        {
          id: '2',
          title:
            'Ég heimila líffæragjöf, en heimildin nær ekki til eftirtalinna líffæra:',
          limitations: [
            { value: 'Bris', type: 'checkbox' },
            { value: 'Lifur', type: 'checkbox' },
            { value: 'Hjarta', type: 'checkbox' },
            { value: 'Lungu', type: 'checkbox' },
            { value: 'Hornhimna', type: 'checkbox' },
            { value: 'Nýru', type: 'checkbox' },
            { value: 'Húð', type: 'checkbox' },
            { value: 'Þarmar', type: 'checkbox' },
            { value: 'Annað', type: 'input' },
          ],
        },
        {
          id: '3',
          title: 'Ég heimila ekki líffæragjöf.',
        },
      ],
    },
  }
  const dataEN: Options = {
    data: {
      options: [
        {
          id: '1',
          title: 'Upon my death, my organs may be used for transplantation.',
        },
        {
          id: '2',
          title:
            'I authorize organ donation, but the authorization does not cover the following organs:',
          limitations: [
            { value: 'Pancreas', type: 'checkbox' },
            { value: 'Liver', type: 'checkbox' },
            { value: 'Heart', type: 'checkbox' },
            { value: 'Lungs', type: 'checkbox' },
            { value: 'Cornea', type: 'checkbox' },
            { value: 'Kidney', type: 'checkbox' },
            { value: 'Skin', type: 'checkbox' },
            { value: 'Intestines', type: 'checkbox' },
            { value: 'Other', type: 'input' },
          ],
        },
        {
          id: '3',
          title: 'I do not authorize organ donation.',
        },
      ],
    },
  }
  return {
    data: locale === 'en' ? dataEN : locale === 'is' ? dataIS : dataIS,
    loading: false,
    error: false,
  }
}
