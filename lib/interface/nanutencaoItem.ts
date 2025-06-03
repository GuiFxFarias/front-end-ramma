export interface ManutencaoItem {
  id?: number;
  equipamento_id: string;
  servico_id?: number;
  descricao: string;
  modelo: string;
  numero_serie: string;
  numero_sensor: string;
  patrimonio: string;
  tag: string;
  acompanha_laudo: string;
  data_registro?: string;
}
