import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Items

| name           | type    | format    | required |
|----------------|---------|-----------|----------|
| id             | integer | bigint    | true     |
| created_at     | string  | timestamp | true     |
| bucketItemName | string  | text      | false    |
| title          | string  | text      | false    |
| description    | string  | text      | false    |
| inventoryId    | integer | bigint    | false    |

Foreign Key Relationships:
- inventoryId references Inventories.id
*/

export const useItem = (id: number) => useQuery({
    queryKey: ['items', id],
    queryFn: () => fromSupabase(supabase.from('Items').select('*').eq('id', id).single()),
});

export const useItems = () => useQuery({
    queryKey: ['items'],
    queryFn: () => fromSupabase(supabase.from('Items').select('*')),
});

export const useAddItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newItem: { bucketItemName?: string; title?: string; description?: string; inventoryId?: number }) => 
            fromSupabase(supabase.from('Items').insert([newItem])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }: { id: number; bucketItemName?: string; title?: string; description?: string; inventoryId?: number }) => 
            fromSupabase(supabase.from('Items').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => 
            fromSupabase(supabase.from('Items').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};