// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from "../_shared/cors.ts";
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { imagePath } = await req.json();
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY");

  // Generate public URL for the image
  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${imagePath}`;

  // Send the image URL to OpenAI
  const openaiResponse = await fetch(
    "https://api.openai.com/v1/images/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        image: imageUrl,
      }),
    },
  );

  const openaiData = await openaiResponse.json();

  return new Response(
    JSON.stringify(openaiData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-embeddings' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
