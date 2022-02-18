const storageKey = 'onBoardingModal'

export const setStorage = () => {
  return sessionStorage.setItem(storageKey, 'hide')
}

export const storageHidden = () => {
  return sessionStorage.getItem(storageKey) === 'hide'
}
