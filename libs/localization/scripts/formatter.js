exports.format = function(msgs) {
  return Object.entries(msgs).reduce((arr, [id, msg], i) => {
    const namespace = id.substring(0, id.lastIndexOf(':'))

    if (!namespace) {
      throw new Error(
        `Namespace missing in id: ${id}, make sure the id is of the format namespace:messageId`,
      )
    }

    return {
      ...arr,
      [namespace]: {
        ...arr[namespace],
        [id]: {
          ...msg,
        },
      },
    }
  }, {})
}
