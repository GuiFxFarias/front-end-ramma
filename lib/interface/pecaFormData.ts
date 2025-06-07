export interface PecaFormData {
  manutencao_id: number;
  item_id: number;
  peca_id: number;
  quantidade: number;
  acao: 'instalacao' | 'substituicao' | 'recuperacao';
  observacao?: string;
  data_registro?: string; // ou Date, se preferir trabalhar com objetos Date
}
