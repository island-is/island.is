export const getInvalidFreightItemIndex = (
  values: (string | undefined)[],
  maxValue: number | undefined,
): number => {
  return values.findIndex(
    (x) =>
      x &&
      !(
        !isNaN(Number(x)) &&
        Number(x) > 0 &&
        (!maxValue || Number(x) <= maxValue)
      ),
  )
}
