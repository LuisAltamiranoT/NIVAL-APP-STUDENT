export type Roles = 'ADMIN';

export interface User {
    uid?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    emailVerified?: boolean;
    role?: Roles;
    photoUrl?: string;
    password?: string;
    codigoUnico?:string;
}