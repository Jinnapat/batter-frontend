"use client";

import supabaseClient from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.signOut().then(
      () => {
        router.push("/login");
      },
      () => {
        router.push("/profile");
      }
    );
  });
  return <p>logging out...</p>;
};

export default LogoutPage;
