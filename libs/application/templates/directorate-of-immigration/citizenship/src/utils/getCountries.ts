interface OptionProps {
  label: string
  value: string
}

export function fetchCountries() {
  const options: Array<OptionProps> = [
    { label: 'Land 1', value: 'Land 1' },
    { label: 'Land 2', value: 'Land 2' },
    { label: 'Land 3', value: 'Land 3' },
    { label: 'Land 4', value: 'Land 4' },
  ]
  // fetch(`https://restcountries.com/v3.1/all?fields=name`)
  //   .then((res) => res.json())
  //   .then((data: any[]) => {
  //     if (data.length) {
  //       data.map(({ name }) => {
  //         options.push({
  //           label: name,
  //           value: name,
  //         })
  //       })
  //     }
  //   })

  return options
}
