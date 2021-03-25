describe('Recorded suite', () => {
	it('My Recorded Test', async () => {
		await element(by.id("BUTTON_LOGIN")).tap();
		//vhhgg
		await device.takeScreenshot("Screenshot 1");
	})
});