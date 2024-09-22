import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseProvider } from "./contexts/SupabaseContext";
import Browse from "./pages/Browse";
import Upload from "./pages/Upload";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Browse />} />
              <Route path="/upload" element={<Upload />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
