import { ManutencaoServico } from '@/lib/interface/manutencaoServico';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getServicos(): Promise<ManutencaoServico[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/servicoManutencao`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    const data = await response.json();
    return data.servicos;
  } catch (error: any) {
    console.error('Erro ao buscar serviços:', error);
    return [];
  }
}
