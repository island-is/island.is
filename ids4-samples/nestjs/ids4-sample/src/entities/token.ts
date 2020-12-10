import { string } from "yup"

export class Token {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}