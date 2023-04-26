export const filterOutExistingSubs = (oldArray, newArray) => {
  const updatedArray = oldArray.filter(function (obj) {
    return newArray.findIndex((x) => x.id == obj.id) == -1
  })
  return updatedArray
}
export const updateSubscriptionArray = (oldArray, newArray) => {
  return filterOutExistingSubs(oldArray, newArray).concat(newArray)
}
