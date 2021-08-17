import { User } from "../entities/user";

export class UserService {
    // TODO: Remove static and make injectable
    public getUser() : User {
        return { name: "Guðrún Jónsdóttir", 
        nationalId: "1706941119",
        address: "Lindargata 3",
        city: "Reykjavík",
        postalCode: "101",
        email: "gj@island.is",
        numberOfChildren: 1
    } as User
    }
}