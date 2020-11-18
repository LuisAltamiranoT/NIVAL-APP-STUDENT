export type Roles = 'EDITOR';

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

export interface Curso{
    uidMateria?: any;
    aula?:any;
    image?:any;
}

export interface Materia{
    nombre?:string;
}

export interface FileI {
    name: string;
    imageFile: File;
    size: string;
    type: string;
  }


export interface Nomina{
    fila?:any,
    id?:any,
    codigoUnico?: any,
    nombre?:any,
    presente?:any,
    atraso?:any,
    falta?:any
    opciones?:any
}

export interface NominaObligatoria{
    codigoUnico: any,
    nombre: any,
}