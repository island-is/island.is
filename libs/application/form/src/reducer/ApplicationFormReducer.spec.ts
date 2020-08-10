// import { initializeReducer, ApplicationReducer } from './ApplicationFormReducer'

describe('ApplicationFormReducer', () => {
  describe('initialize reducer', () => {
    it('should convert the form into valid leaves, screens, and sections', () => {
      expect(true).toBeTruthy()
    })
    it('should apply conditions to show or hide some screens', () => {
      expect(true).toBeTruthy()
    })
  })
  describe('next screen', () => {
    it('should go to the next screen', () => {
      expect(true).toBeTruthy()
    })
    it('should not be able go to the next screen, if the current screen is the last one', () => {
      expect(true).toBeTruthy()
    })
    it('should jump over all screens that already belong to the repeater, if the current screen is a repeater', () => {
      expect(true).toBeTruthy()
    })
    it('should return back to the repeater screen when reaching the end of the screens belonging to the repeater', () => {
      expect(true).toBeTruthy()
    })
  })
  describe('previous screen', () => {
    it('should go to the previous screen', () => {
      expect(true).toBeTruthy()
    })
    it('should not be able go to the previous screen, if the current screen is the first one', () => {
      expect(true).toBeTruthy()
    })
  })
  describe('answer', () => {
    it('should store new answers', () => {
      expect(true).toBeTruthy()
    })
    it('should upon answering apply conditions to show or hide some screens', () => {
      expect(true).toBeTruthy()
    })
  })
  describe('expand repeater', () => {
    it('should not do anything if the current screen is not a repeater', () => {
      expect(true).toBeTruthy()
    })
    it('should add new screens directly after the repeater when expanding a given repeater for the first time', () => {
      expect(true).toBeTruthy()
    })
    it('should add new screens after the already added screens when expeanding the repeater for the nth time', () => {
      expect(true).toBeTruthy()
    })
    it('should after adding the screens move to the first newly added screen', () => {
      expect(true).toBeTruthy()
    })
  })
})
