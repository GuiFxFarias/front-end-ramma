'use client';

import { ManutencaoItem } from '@/lib/interface/nanutencaoItem';
import { useQuery } from 'react-query';
import { getItensByServicoId } from './api/getItemProServicoId';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ItensDaOS({ servicoId }: { servicoId: number }) {
  const { data: itens = [], isLoading } = useQuery(['itensOs', servicoId], () =>
    getItensByServicoId(servicoId)
  );

  if (isLoading)
    return <p className='text-sm text-gray-500'>Carregando itens...</p>;

  if (itens.length === 0)
    return (
      <p className='text-sm text-muted-foreground'>Nenhum item encontrado.</p>
    );

  return (
    <div className='space-y-3 max-h-[400px] overflow-y-auto'>
      {itens.map((item: ManutencaoItem) => (
        <div
          key={item.id}
          className='border p-3 rounded bg-muted text-sm text-gray-700 space-y-1'
        >
          <div className='font-medium'>
            {item.descricao} —{' '}
            <span className='text-xs italic'>{item.modelo}</span>
          </div>
          <div className='text-xs text-gray-500'>
            Nº Série: {item.numero_serie} | Sensor: {item.numero_sensor}
          </div>
          <div className='text-xs text-gray-500'>
            Patrimônio: {item.patrimonio} | TAG: {item.tag}
          </div>
          <div className='text-xs text-gray-600 mt-1'>
            <strong>Laudo:</strong> {item.acompanha_laudo}
          </div>

          {/* Botão de ação */}
          <div className='text-right'>
            <Link
              href={`/manutencao/item/${item.id}/pecas/${item.equipamento_id}`}
            >
              <Button size='sm' className='mt-2'>
                Selecionar Peças
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
