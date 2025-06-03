'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getClientes } from '@/app/(app)/servicos/api/clientes';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { postNovaOS } from '@/app/(app)/manutencao/api/postNovaOs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const tiposServico = ['Fornecimento', 'Manutenção', 'Pintura', 'Outros'];

// 🧩 Schema
const formSchema = z.object({
  id: z.string().optional(),
  data_abertura: z.string().min(1, 'Data obrigatória'),
  tipo_servico: z.string().min(1, 'Tipo obrigatório'),
  cliente_id: z.string().min(1, 'Cliente obrigatório'),
  anexo_doc: z.instanceof(FileList).optional(),
});

// 🧾 Tipagem
type FormSchema = z.infer<typeof formSchema>;

export function DialogNovaOS() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutateOs = useMutation({
    mutationFn: (body: FormSchema) => postNovaOS(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendas']);
    },
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_abertura: '',
      tipo_servico: '',
      cliente_id: '',
      anexo_doc: undefined,
    },
  });

  const { data: dataCliente = [] } = useQuery(['clientes'], getClientes);

  const onSubmit = async (data: FormSchema) => {
    const payload = {
      data_abertura: data.data_abertura,
      tipo_servico: data.tipo_servico,
      cliente_id: data.cliente_id,
      anexo_doc: data.anexo_doc,
    };

    mutateOs.mutate(payload, {
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
  };

  return (
    <div className='flex gap-8 items-start'>
      <Dialog>
        <DialogTrigger className='bg-blue-500 rounded-md p-2 text-white'>
          + Nova O.S.
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <DialogHeader>
                <DialogTitle>Criar Ordem de Serviço</DialogTitle>
              </DialogHeader>

              {/* Data de Abertura */}
              <FormField
                control={form.control}
                name='data_abertura'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Abertura</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Serviço */}
              <FormField
                control={form.control}
                name='tipo_servico'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposServico.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cliente */}
              <FormField
                control={form.control}
                name='cliente_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um cliente' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataCliente.map(
                          (cliente: { id: number; nome: string }) => (
                            <SelectItem
                              key={cliente.id}
                              value={String(cliente.id)}
                            >
                              {cliente.nome}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='anexo_doc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anexos (múltiplos arquivos)</FormLabel>
                    <FormControl>
                      <div className='flex flex-col gap-2'>
                        <label className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium w-fit'>
                          Selecionar arquivos
                          <input
                            type='file'
                            multiple
                            onChange={(e) => field.onChange(e.target.files)}
                            className='hidden'
                          />
                        </label>
                        {field.value && (
                          <ul className='text-sm text-zinc-700 dark:text-zinc-300'>
                            {Array.from(field.value as FileList).map(
                              (file, idx) => (
                                <li key={idx}>{file.name}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='submit'>Salvar O.S.</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
