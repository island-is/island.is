import { Controller, Get } from '@nestjs/common';

@Controller('UserProfile')
@Controller('user-profile')
export class UserProfileController {

	constructor() { }

	@Get()
	public getStuff() {
		return 'UserProfile'
	}
}
