import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../contexts/SupabaseContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
}

const Browse: React.FC = () => {
  const { supabase } = useSupabase();
  const [search, setSearch] = useState('');

  const fetchInventory = async (): Promise<InventoryItem[]> => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .ilike('name', `%${search}%`);
    
    if (error) throw error;
    return data;
  };

  const { data: inventory, isLoading, error } = useQuery({
    queryKey: ['inventory', search],
    queryFn: fetchInventory,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse Inventory</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2"
        />
        <Button onClick={() => {}}>Search</Button>
      </div>
      <ul>
        {inventory?.map((item) => (
          <li key={item.id} className="mb-2 p-2 border rounded">
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Browse;