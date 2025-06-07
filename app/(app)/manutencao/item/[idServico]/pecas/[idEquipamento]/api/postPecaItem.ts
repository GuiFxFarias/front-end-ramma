/* eslint-disable @typescript-eslint/no-explicit-any */
import { PecaFormData } from '@/lib/interface/pecaFormData';

export async function postManutencaoPecaItem(data: PecaFormData): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/manutencao/pecas-item`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erro ao enviar peça de manutenção:', error);
    throw error;
  }
}
