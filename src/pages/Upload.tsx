import React, { useState } from "react";
import { useSupabase } from "../contexts/SupabaseContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Upload: React.FC = () => {
  const { supabase, user } = useSupabase();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to upload inventory.");
      return;
    }

    try {
      // Upload image to Supabase Storage
      let imagePath: string | null = null;
      if (image) {
        const { data, error } = await supabase.storage
          .from("inventory-images")
          .upload(`${Date.now()}-${image.name}`, image);
        if (error) throw error;
        console.log(data);
        imagePath = data.path;
      }

      // Call the generate-embeddings edge function
      const { data: result, error: funcError } =
        await supabase.functions.invoke("generate-embeddings", {
          body: { imagePath },
        });

      if (funcError) {
        throw new Error("Failed to generate embeddings");
      }

      console.log(result);
    } catch (error) {
      console.error("Error uploading inventory:", error);
      alert("Failed to upload inventory item.");
    }
  };

  if (!user) {
    return <div>Please sign in to upload inventory.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Inventory</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name:
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description:
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Image:
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <Button type="submit">Upload Inventory</Button>
      </form>
    </div>
  );
};

export default Upload;
