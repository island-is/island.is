exports.format = function(msgs) {
  return Object.entries(msgs).reduce((arr, [id, msg], i) => {
    const [namespace, msgId] = id.split(':')

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
