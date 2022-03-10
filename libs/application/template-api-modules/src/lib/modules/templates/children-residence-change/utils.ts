const syslumennOffices = {
  reykjavik: {
    postalCodePrefixes: ['1', '20', '21', '22', '27'],
    email: 'fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á höfuðborgarsvæðinu',
  },
  sudurnes: {
    postalCodePrefixes: ['23', '24', '25', '26'],
    email: 'sudurnes.fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á Suðurnesjum',
  },
  vesturland: {
    postalCodePrefixes: ['3'],
    email: 'vesturland.sifjamal@syslumenn.is',
    name: 'Sýslumaðurinn á Vesturlandi',
  },
  vestfirdir: {
    postalCodePrefixes: ['4'],
    email: 'vestfirdir.fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á Vestfjörðum',
  },
  nordurlandVestra: {
    postalCodePrefixes: ['5'],
    email: 'nordurlandvestra@syslumenn.is',
    name: 'Sýslumaðurinn á Norðurlandi vestra',
  },
  nordurlandEystra: {
    postalCodePrefixes: ['6'],
    email: 'nordurlandeystra.fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á Norðurlandi eystra',
  },
  austurland: {
    postalCodePrefixes: ['7'],
    email: 'austurland.fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á Austurlandi',
  },
  sudurland: {
    postalCodePrefixes: ['8'],
    email: 'sudurland.fjolskylda@syslumenn.is',
    name: 'Sýslumaðurinn á Suðurlandi',
  },
  vestmannaeyjar: {
    postalCodePrefixes: ['9'],
    email: 'arndis@syslumenn.is',
    name: 'Sýslumaðurinn í Vestmannaeyjum',
  },
}

export function syslumennDataFromPostalCode(postalCode: string) {
  for (const [, value] of Object.entries(syslumennOffices)) {
    if (
      value.postalCodePrefixes.some((prefix) => postalCode.startsWith(prefix))
    ) {
      return value
    }
  }
  // This should not happen but if it does then it is better to send to some syslumenn office instead of skipping it
  return syslumennOffices.reykjavik
}
