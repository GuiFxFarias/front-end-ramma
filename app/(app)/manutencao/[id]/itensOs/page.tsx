'use client';

import { useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'react-query';

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

const schema = z.object({
  itens: z.array(
    z.object({
      equipamentoId: z.string().min(1, 'Selecione um equipamento'),
      descricao: z.string().min(1, 'Campo obrigatório'),
      modelo: z.string().min(1, 'Campo obrigatório'),
      numero_serie: z.string().optional(),
      numero_sensor: z.string().optional(),
      patrimonio: z.string().optional(),
      tag: z.string().optional(),
      acompanha_laudo: z.string().min(1, 'Preencha o laudo'),
    })
  ),
});

type FormSchema = z.infer<typeof schema>;

export default function ItensOSPage() {
  const { id } = useParams();
  const { data: equipamentos } = useQuery(['equipamentos'], getEquipamentos);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      itens: [
        {
          equipamentoId: '',
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

  const onSubmit = (data: FormSchema) => {
    console.log('Itens salvos (mock):', data);
    toast.success('Itens salvos com sucesso!');
  };

  return (
    <div className='max-w-4xl mx-auto py-10 space-y-6'>
      <h1 className='text-2xl font-bold'>Acompanhar Itens da OS #{id}</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 overflow-y-auto'
        >
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='p-6 border rounded-lg shadow-sm bg-white space-y-4'
            >
              {/* Equipamento */}
              <FormField
                control={form.control}
                name={`itens.${index}.equipamentoId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um equipamento' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipamentos?.map((eq: IEquipamento) => (
                          <SelectItem key={eq.ID} value={String(eq.ID)}>
                            {eq.Descricao}
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
          ))}

          <Button
            type='button'
            variant='secondary'
            onClick={() =>
              append({
                equipamentoId: '',
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
    </div>
  );
}
