/* eslint-disable prettier/prettier */
export class LoginInfoDto {
    id: number;
    username: string;
    token:string;
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id: number, username: string, token:string, refreshToken: string, refreshTokenExpiresAt: string) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    }
}