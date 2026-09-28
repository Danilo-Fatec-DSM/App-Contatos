export interface Contato {
  _id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  fotoId?: string;
}

/** Dados enviados à API ao criar ou editar um contato (o _id é gerado pelo servidor). */
export type ContatoInput = Omit<Contato, '_id'>;
