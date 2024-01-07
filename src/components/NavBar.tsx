"use client";

import Link from "next/link";
import supabaseClient from "@/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const NavBar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then((e) => {
      setSession(e.data.session);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="w-full flex flex-row justify-between px-8 py-3 bg-green-600 shadow-lg text-white text-xl items-center">
      <Link href="/" className="hover:text-yellow-400 duration-300 text-3xl">
        BATTER
      </Link>
      <div className="flex flex-row gap-5 items-center">
        {!isLoading && session && (
          <>
            <Link href="/book" className="hover:text-yellow-400 duration-300">
              book
            </Link>
            <Link
              href="/reservations"
              className="hover:text-yellow-400 duration-300"
            >
              reservations
            </Link>
            <Link
              href="/profile"
              className="hover:text-yellow-400 duration-300"
            >
              profile
            </Link>
            <Link href="/logout" className="hover:text-yellow-400 duration-300">
              logout
            </Link>
          </>
        )}
        {!isLoading && !session && (
          <>
            <Link href="/login" className="hover:text-yellow-400 duration-300">
              login
            </Link>
            <Link
              href="/register"
              className="hover:text-yellow-400 duration-300"
            >
              register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
