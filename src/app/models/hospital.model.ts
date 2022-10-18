export interface _HospitalUsuario {
    id: string;
    nombre: string;
    img: string;
}

export class Hospital {
    
    constructor(
        public nombre: string,
        public id?: number,
        public img?: string,
        public usuario?: _HospitalUsuario,
    ) {}
}