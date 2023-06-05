interface OptionProps {
  label: string
  value: string
}

export function fetchCountries() {
  const options: Array<OptionProps> = []
  fetch(`https://restcountries.com/v3.1/all?fields=name`)
    .then((res) => res.json())
    //TODO: Change type
    .then((data: any[]) => {
      if (data.length) {
        data.map(({ name }) => {
          options.push({
            label: name,
            value: name,
          })
        })
      }
    })

  return options
}
