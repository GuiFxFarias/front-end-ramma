import { ManutencaoItem } from '@/lib/interface/nanutencaoItem';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postItensOS(
  id: string | number,
  itens: ManutencaoItem[]
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/manutencao/${id}/itensOs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itens }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erro ao inserir itens da OS:', error);
    return { sucesso: false, erro: error.message };
  }
}
