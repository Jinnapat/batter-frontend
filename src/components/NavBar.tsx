"use client";

import Link from "next/link";

const NavBar = () => {
  const isAuthenticated = true;

  return (
    <div className="w-full flex flex-row justify-between px-8 py-3 bg-green-600 shadow-lg text-white text-xl items-center">
      <Link href="/" className="hover:text-yellow-400 duration-300 text-3xl">
        BATTER
      </Link>
      <div className="flex flex-row gap-3">
        {isAuthenticated && (
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
          </>
        )}
        {!isAuthenticated && (
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
