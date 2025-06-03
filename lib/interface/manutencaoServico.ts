export interface ManutencaoServico {
  id: number;
  data_abertura: string;
  tipo_servico: string;
  cliente_id: number;
  referencia: string;
  acompanha_laudo: boolean;
  anexo_doc: string | null;
  nf: string;
  romaneio: string;
  outros_documentos: string | null;
  status_atual: string;
  criado_em: string;
  valor_final?: string;
}
