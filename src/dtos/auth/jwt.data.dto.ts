/* eslint-disable prettier/prettier */
export class JwtDataDto {
    role: "administrator" | "nastavnik" | "ucenik"
    id: number;
    identitet: string;
    exp: number;
    ip: string;
    ua: string

    toPlainObject() {
        return {
            adminstratorId: this.id,
            username: this.identitet,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}