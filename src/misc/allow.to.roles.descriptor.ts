/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common"

export const AllowToRoles = (...roles: ('administrator' | 'nastavnik' | 'ucenik')[]) => {
    return SetMetadata('allow_to_roles', roles)
}