import { Locale } from '@island.is/shared/types'

interface Data {
  title: string
  description: string
  limitations?: string[]
}

interface OrganDonor {
  data: Data
}

export interface OptionsOptions {
  id: string
  title: string
  limitations?: string[]
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
            'Bris',
            'Lifur',
            'Hjarta',
            'Lungu',
            'Hornhimna',
            'Nýru',
            'Húð',
            'Þarmar',
            'Annað',
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
            'Pancreas',
            'Liver',
            'Heart',
            'Lungs',
            'Cornea',
            'Kidney',
            'Húð',
            'Þarmar',
            'Other',
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
