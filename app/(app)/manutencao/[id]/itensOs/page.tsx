'use client';

import { useParams } from 'next/navigation';
import FormAddItens from './formAddItens';

export default function ItensOSPage() {
  const { id } = useParams();

  return (
    <div className='max-w-4xl mx-auto py-10 space-y-6'>
      <h1 className='text-2xl font-bold'>Acompanhar Itens da OS #{id}</h1>
      <FormAddItens id={String(id)} />
    </div>
  );
}
