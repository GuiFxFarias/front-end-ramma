'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { useQuery } from 'react-query';
// import { IEquipamento } from '@/lib/interface/Iequipamento';
// import { IService } from '@/lib/interface/IService';
// import { DialogVerProposta } from '@/app/(app)/servicos/dialogVerProposta';
// import { useMemo } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { NewServiceDialog } from '../servicos/newServiceDialog';
// import { NewSalePecasDialog } from '../servicos/newSaleDialog';
// import PecasVenda from '../servicos/salvePecaAvulsa';
import { DialogNovaOS } from '@/components/dialogOs';
import { useQuery } from 'react-query';
import { getServicos } from './api/getServicoManutencao';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ItensDaOS } from './itensOS';

export default function ManutencaoItens() {
  // const [search, setSearch] = useState<string>('');

  //   const { data: services = [], isLoading } = useQuery(
  //     ['services'],
  //     getServices
  //   );

  //   const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  //   const groupedServices = useMemo(() => {
  //     if (!Array.isArray(services) || isLoading) return {};

  //     return services.reduce((acc, service: IService) => {
  //       if (!acc[service.codService]) {
  //         acc[service.codService] = [];
  //       }
  //       acc[service.codService].push(service);
  //       return acc;
  //     }, {} as Record<string, IService[]>);
  //   }, [services, isLoading]);

  //   const filterCodService: [string, IService[]][] =
  //     Object.entries(groupedServices);

  //   const filteredServices: [string, IService[]][] = useMemo(() => {
  //     return filterCodService.filter(([, items]) =>
  //       items[0]?.descCliente?.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }, [filterCodService, search]);

  const { data: servicos = [], isLoading } = useQuery(
    ['servicosManutencao'],
    getServicos
  );

  return (
    <div className='flex-1 p-4 sm:p-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Lista de Serviços
        </h1>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
          <DialogNovaOS />
        </div>
      </div>

      {/* Lista com scroll */}
      <div className='h-[500px] overflow-y-auto space-y-4 pr-2'>
        {isLoading ? (
          <p>Carregando serviços...</p>
        ) : (
          servicos.map((servico) => (
            <Card key={servico.id} className='border border-gray-200 shadow-sm'>
              <CardContent className='p-4 space-y-2 space-x-2'>
                <div className='text-sm font-semibold text-gray-800'>
                  #{servico.id} – {servico.tipo_servico}
                </div>
                <div className='text-sm text-gray-500'>
                  Abertura:{' '}
                  {new Date(servico.data_abertura).toLocaleDateString('pt-BR')}
                </div>
                <Badge variant='outline' className='text-xs'>
                  {servico.status_atual}
                </Badge>

                {/* Dialog para ver itens */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge
                      variant='outline'
                      className='text-xs cursor-pointer hover:bg-zinc-200'
                    >
                      Ver Itens
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className='w-[60vw]'>
                    <DialogHeader>
                      <DialogTitle>Itens da OS #{servico.id}</DialogTitle>
                    </DialogHeader>
                    <div className='mt-2'>
                      <ItensDaOS servicoId={servico.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
