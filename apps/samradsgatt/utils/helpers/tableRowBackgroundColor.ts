import isEvenCheck from "./isEvenCheck"

const tableRowBackgroundColor = (idx: number) => {
    const isEven = isEvenCheck(idx)
    return isEven ? 'blue100' : 'transparent'
}

export default tableRowBackgroundColor