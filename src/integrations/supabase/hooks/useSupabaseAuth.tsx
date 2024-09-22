import { useContext } from "react";
import { SupabaseAuthContext } from "../auth";

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};
