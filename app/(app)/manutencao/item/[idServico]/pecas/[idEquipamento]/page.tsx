'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPecasItemId } from '@/app/(app)/servicos/api/getPecasItemId';
import { getEquipamentoId } from '@/app/(app)/servicos/novoServico/api/postService';
import { Item } from '@/lib/interface/Ipecas';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PecaFormData } from '@/lib/interface/pecaFormData';
import { postManutencaoPecaItem } from './api/postPecaItem';

export default function Page() {
  const params = useParams();
  const idEquipamento = params?.idEquipamento as string;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: equipamento, isLoading: loadingEquipamento } = useQuery(
    ['equipamento', idEquipamento],
    () => getEquipamentoId(idEquipamento),
    { enabled: !!idEquipamento }
  );

  const itemID = equipamento?.ItemID;

  const { data: pecas = [], isLoading: loadingPecas } = useQuery(
    ['pecasItemId', itemID],
    () => getPecasItemId(String(itemID)),
    { enabled: !!itemID }
  );

  const [acoesSelecionadas, setAcoesSelecionadas] = useState<{
    [pecaId: number]: 'instalacao' | 'substituicao' | 'recuperacao';
  }>({});

  const handleChangeAcao = (pecaId: number, value: string) => {
    setAcoesSelecionadas((prev) => ({
      ...prev,
      [pecaId]: value as 'instalacao' | 'substituicao' | 'recuperacao',
    }));
  };

  const acoes = [
    { value: 'instalacao', label: 'Instalação' },
    { value: 'recuperacao', label: 'Recuperação' },
    { value: 'substituicao', label: 'Substituição' },
  ];

  const mutateItemPeca = useMutation({
    mutationFn: (body: PecaFormData) => postManutencaoPecaItem(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['pecasItemId']);
    },
  });

  if (loadingEquipamento || loadingPecas) return <p>Carregando...</p>;
  if (!equipamento) return <p>Equipamento não encontrado.</p>;

  function onSubmit() {
    mutateItemPeca.mutate(payload, {
      onSuccess: (res: { sucesso: boolean; id: string }) => {
        const idCriado = res?.id;
        if (!idCriado) {
          toast.error('ID não retornado pela API');
          return;
        }

        toast.success('Serviço emitido com sucesso!');
        router.push(`/manutencao/${idCriado}/itensOs`);
      },
      onError: () => {
        toast.error('Erro ao emitir o serviço.');
      },
    });
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Peças do Equipamento</h1>
      <p className='mb-2 text-gray-600'>
        Equipamento: {equipamento?.Descricao}
      </p>

      <div className='space-y-4'>
        {pecas.map((peca: Item) => (
          <div
            key={peca.ID}
            className='border p-3 rounded shadow bg-white dark:bg-gray-900 space-y-2'
          >
            <div className='flex justify-between items-center'>
              <div>
                <p className='font-semibold'>{peca.Descricao}</p>
                <p className='text-sm text-gray-500'>Qtd: {peca.Quantidade}</p>
              </div>
              <div className='w-40'>
                <Select
                  onValueChange={(value) => handleChangeAcao(peca.ID, value)}
                  value={acoesSelecionadas[peca.ID] || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecionar ação' />
                  </SelectTrigger>
                  <SelectContent>
                    {acoes.map((acao) => (
                      <SelectItem key={acao.value} value={acao.value}>
                        {acao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button className='mt-6'>Salvar Todas as Peças</Button>
    </div>
  );
}
