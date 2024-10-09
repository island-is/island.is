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
  name: string
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
          title: 'Við andlát mitt má nota líffæri mín til líffæragjafa.',
        },
        {
          id: '2',
          title:
            'Ég gef leyfi fyrir líffæragjöf að undanskildum eftirfarandi líffærum:',
          limitations: [
            { name: 'Hjarta', type: 'checkbox' },
            { name: 'Lungu', type: 'checkbox' },
            { name: 'Lifur', type: 'checkbox' },
            { name: 'Nýru', type: 'checkbox' },
            { name: 'Bris', type: 'checkbox' },
            { name: 'Þarmar', type: 'checkbox' },
            // { name: 'Annað', type: 'checkbox' },
            { name: 'Hornhimna', type: 'checkbox' },
            // { name: 'Annað', type: 'input' },
          ],
        },
        {
          id: '3',
          title: 'Ég banna líffæragjöf.',
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
            { name: 'Heart', type: 'checkbox' },
            { name: 'Lungs', type: 'checkbox' },
            { name: 'Liver', type: 'checkbox' },
            { name: 'Kidneys', type: 'checkbox' },
            { name: 'Pancreas', type: 'checkbox' },
            { name: 'Intestines', type: 'checkbox' },
            // { name: 'Other', type: 'checkbox' },
            { name: 'Cornea', type: 'checkbox' },
            // { name: 'Other', type: 'input' },
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
