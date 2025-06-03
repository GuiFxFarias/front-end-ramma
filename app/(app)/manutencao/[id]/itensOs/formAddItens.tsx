'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { getEquipamentos } from '@/app/(app)/servicos/api/getEquipamentos';
import { IEquipamento } from '@/lib/interface/Iequipamento';
import { postItensOS } from './api/postItemOs';
import { ManutencaoItem } from '@/lib/interface/nanutencaoItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const itemSchema = z.object({
  itens: z.array(
    z.object({
      equipamento_id: z.string().min(1, 'Selecione um equipamento'),
      descricao: z.string().min(1, 'Campo obrigatório'),
      modelo: z.string().min(1, 'Campo obrigatório'),
      numero_serie: z.string(),
      numero_sensor: z.string(),
      patrimonio: z.string(),
      tag: z.string(),
      acompanha_laudo: z.string(),
    })
  ),
});

type FormSchema = z.infer<typeof itemSchema>;

export default function FormAddItens({ id }: { id: string }) {
  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  const form = useForm<FormSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itens: [
        {
          descricao: '',
          modelo: '',
          numero_serie: '',
          numero_sensor: '',
          patrimonio: '',
          tag: '',
          acompanha_laudo: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'itens',
  });

  const mutateItens = useMutation({
    mutationFn: ({ id, itens }: { id: string; itens: ManutencaoItem[] }) =>
      postItensOS(id, itens),
  });

  const onSubmit = (data: FormSchema) => {
    const itensTratados = data.itens.map((item) => ({
      equipamento_id: item.equipamento_id,
      descricao: item.descricao,
      modelo: item.modelo,
      numero_serie: item.numero_serie,
      numero_sensor: item.numero_sensor,
      patrimonio: item.patrimonio,
      tag: item.tag,
      acompanha_laudo: item.acompanha_laudo,
    }));

    mutateItens.mutate(
      { id, itens: itensTratados },
      {
        onSuccess: () => {
          toast.success('Itens salvos com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao salvar itens.');
        },
      }
    );
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 overflow-y-auto h-[90vh]'
      >
        <Accordion type='multiple'>
          {fields.map((field, index) => (
            <AccordionItem key={field.id} value={field.id}>
              <AccordionTrigger>Equipamento {index + 1}</AccordionTrigger>

              <AccordionContent>
                <div
                  key={field.id}
                  className='p-6 border rounded-lg shadow-sm bg-white space-y-4'
                >
                  <FormField
                    control={form.control}
                    name={`itens.${index}.equipamento_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipamento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione um equipamento' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipamentos?.map((eq: IEquipamento) => (
                              <SelectItem key={eq.ID} value={String(eq.ID)}>
                                {eq.Descricao} – {eq.Modelo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dados técnicos */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input placeholder='Descrição' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`itens.${index}.modelo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder='Modelo' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`itens.${index}.numero_serie`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Série</FormLabel>
                          <FormControl>
                            <Input placeholder='Número de série' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`itens.${index}.numero_sensor`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Sensor</FormLabel>
                          <FormControl>
                            <Input placeholder='Número do sensor' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`itens.${index}.patrimonio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patrimônio</FormLabel>
                          <FormControl>
                            <Input placeholder='Patrimônio' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`itens.${index}.tag`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TAG</FormLabel>
                          <FormControl>
                            <Input placeholder='TAG' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Laudo */}
                  <FormField
                    control={form.control}
                    name={`itens.${index}.acompanha_laudo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Laudo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Descreva o acompanhamento/laudo...'
                            className='min-h-[100px] resize-none'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botão de remover */}
                  <div className='text-right'>
                    {fields.length > 1 && (
                      <Button
                        variant='outline'
                        type='button'
                        onClick={() => remove(index)}
                        className='text-red-500 border-red-500 hover:bg-red-100'
                      >
                        Remover item
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button
          type='button'
          variant='secondary'
          onClick={() =>
            append({
              equipamento_id: '',
              descricao: '',
              modelo: '',
              numero_serie: '',
              numero_sensor: '',
              patrimonio: '',
              tag: '',
              acompanha_laudo: '',
            })
          }
        >
          + Adicionar outro item
        </Button>

        <Button type='submit' className='w-full mt-4'>
          Salvar Itens
        </Button>
      </form>
    </Form>
  );
}
