import React, { useState } from "react";
import { useInventories } from "../integrations/supabase/hooks/inventories";
import { useItems } from "../integrations/supabase/hooks/items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Inventory } from "../integrations/supabase/hooks/inventories";
import { Item } from "../integrations/supabase/hooks/items";

const Browse: React.FC = () => {
  const [search, setSearch] = useState("");

  const {
    data: inventories,
    isLoading: inventoriesLoading,
    error: inventoriesError,
  } = useInventories();

  if (inventoriesLoading) return <div>Loading...</div>;
  if (inventoriesError)
    return <div>Error: {(inventoriesError as Error).message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse Inventories</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search inventories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2"
        />
        <Button onClick={() => {}}>Search</Button>
      </div>
      <ul>
        {inventories?.map((inventory) => (
          <InventoryItems
            key={inventory.id}
            inventory={inventory}
            search={search}
          />
        ))}
      </ul>
    </div>
  );
};

const InventoryItems: React.FC<{ inventory: Inventory; search: string }> = ({
  inventory,
  search,
}) => {
  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useItems(inventory.id);

  if (itemsLoading) return <div>Loading items...</div>;
  if (itemsError) return <div>Error: {(itemsError as Error).message}</div>;

  const filteredItems = items?.filter((item: Item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <li className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">{inventory.id}</h2>
      <ul>
        {filteredItems?.map((item: Item) => (
          <li key={item.id} className="mb-2 p-2 border rounded">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Browse;
