export type UserRole = 'admin' | 'user';

export interface Usuario {
  id?: number | string
  nome: string
  senha: string
  email: string
  perfil: UserRole
  department?: string // Campo opcional para departamento/cargo
}