const syslumennOffices = {
  reykjavik: {
    postalCodePrefixes: ['1', '20', '21', '22', '27'],
    email: 'fjolskylda@syslumenn.is',
  },
  sudurnes: {
    postalCodePrefixes: ['23', '24', '25', '26'],
    email: 'sudurnes.fjolskylda@syslumenn.is',
  },
  vesturland: {
    postalCodePrefixes: ['3'],
    email: 'vesturland.sifjamal@syslumenn.is',
  },
  vestfirdir: {
    postalCodePrefixes: ['4'],
    email: 'vestfirdir.fjolskylda@syslumenn.is',
  },
  nordurlandVestra: {
    postalCodePrefixes: ['5'],
    email: 'nordurlandvestra.fjolskylda@syslumenn.is',
  },
  nordurlandEystra: {
    postalCodePrefixes: ['6'],
    email: 'nordurlandeystra.fjolskylda@syslumenn.is',
  },
  austurland: {
    postalCodePrefixes: ['7'],
    email: 'austurland.fjolskylda@syslumenn.is',
  },
  sudurland: {
    postalCodePrefixes: ['8'],
    email: 'sudurland.fjolskylda@syslumenn.is',
  },
  vestmannaeyjar: {
    postalCodePrefixes: ['9'],
    email: 'vestmannaeyjar.fjolskylda@syslumenn.is',
  },
}

export function syslumennEmailFromPostalCode(postalCode: string) {
  for (const [, value] of Object.entries(syslumennOffices)) {
    if (
      value.postalCodePrefixes.some((prefix) => postalCode.startsWith(prefix))
    ) {
      return value.email
    }
  }
  // This should not happen but if it does then it is better to send to some syslumenn office instead of skipping it
  return syslumennOffices.reykjavik.email
}
