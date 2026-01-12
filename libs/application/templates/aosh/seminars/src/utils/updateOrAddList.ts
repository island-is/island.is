/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateOrAdd = (
  list: Array<any>,
  pathValue: string,
  newObj: any,
): void => {
  const index = list.findIndex((item) => item.path === pathValue)

  if (index !== -1) {
    list[index] = { ...list[index], ...newObj } // Update existing object
  } else {
    list.push(newObj) // Add new object
  }
}
