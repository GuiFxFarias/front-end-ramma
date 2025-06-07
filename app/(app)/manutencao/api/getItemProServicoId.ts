import { ManutencaoItem } from '@/lib/interface/nanutencaoItem';

export async function getItensByServicoId(
  id: number | string
): Promise<ManutencaoItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/manutencao/${id}/itensOs`
  );
  if (!res.ok) {
    throw new Error('Erro ao buscar itens da OS');
  }
  return res.json();
}
