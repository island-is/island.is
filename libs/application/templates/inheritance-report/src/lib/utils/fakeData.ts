export const isFakePerson = (nationalId: string) => {
  return (
    (nationalId.startsWith('010130') &&
      [
        '7789',
        '3019',
        '2399',
        '2989',
        '2639',
        '2719',
        '4929',
        '5069',
        '2129',
        '2209',
        '2479',
      ].includes(nationalId.slice(-4))) ||
    (nationalId.startsWith('240915') && nationalId.endsWith('1460'))
  )
}
