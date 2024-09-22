import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

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

export type Item = {
  id: number;
  created_at: string;
  bucketItemName?: string;
  title?: string;
  description?: string;
  inventoryId?: number;
};

export const useItem = (id: number) =>
  useQuery({
    queryKey: ["items", id],
    queryFn: () =>
      fromSupabase(supabase.from("Items").select("*").eq("id", id).single()),
  });

export const useItems = (inventoryId?: number) =>
  useQuery({
    queryKey: ["items", inventoryId],
    queryFn: () =>
      fromSupabase(
        inventoryId
          ? supabase.from("Items").select("*").eq("inventoryId", inventoryId)
          : supabase.from("Items").select("*")
      ),
  });

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: Omit<Item, "id" | "created_at">) =>
      fromSupabase(supabase.from("Items").insert([newItem])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...updateData
    }: Partial<Omit<Item, "created_at">> & { id: number }) =>
      fromSupabase(supabase.from("Items").update(updateData).eq("id", id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fromSupabase(supabase.from("Items").delete().eq("id", id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
