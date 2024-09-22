// Import all the relevant exports from other files in the supabase directory
import { supabase } from "./supabase";
import {
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
} from "./auth";

// Import hooks
import {
  useInventory,
  useInventories,
  useAddInventory,
  useUpdateInventory,
  useDeleteInventory,
} from "./hooks/inventories";

import {
  useItem,
  useItems,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "./hooks/items";

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useInventory,
  useInventories,
  useAddInventory,
  useUpdateInventory,
  useDeleteInventory,
  useItem,
  useItems,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
};
