import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Inventories

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | bigint    | true     |
| created_at | string                   | timestamp | true     |
| userId     | string                   | uuid      | false    |

*/

export const useInventory = (id: number) => useQuery({
    queryKey: ['inventories', id],
    queryFn: () => fromSupabase(supabase.from('Inventories').select('*').eq('id', id).single()),
});

export const useInventories = () => useQuery({
    queryKey: ['inventories'],
    queryFn: () => fromSupabase(supabase.from('Inventories').select('*')),
});

export const useAddInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newInventory: { userId?: string }) => 
            fromSupabase(supabase.from('Inventories').insert([newInventory])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};

export const useUpdateInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }: { id: number; userId?: string }) => 
            fromSupabase(supabase.from('Inventories').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};

export const useDeleteInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => 
            fromSupabase(supabase.from('Inventories').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};