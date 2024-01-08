"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { Reservation } from "@/types/reservation";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

const ReservationsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!user) return;
    supabaseClient
      .from("reservations")
      .select()
      .eq("owner_id", user.id)
      .then((response) => {
        if (response.error) {
          setErrorMessage(response.error.message);
          return;
        }
        setReservations(response.data);
        setIsGettingReservationInfo(false);
        console.log(response.data);
      });
  }, [user]);

  return (
    <SessionChecker jumpToIfUnauthenticated="/login" setUser={setUser}>
      {isGettingReservationInfo && <Loading />}
      {!isGettingReservationInfo && (
        <div className="w-full flex flex-col items-center max-w-2xl gap-3 shadow-lg rounded-2xl p-10 bg-white">
          <div className="w-full">
            <h1 className="font-bold text-4xl text-center">
              Your Reservations
            </h1>
            <p className="text-center text-sm mb-3">
              see status of your current reservations
            </p>
            <p className="text-sm text-center text-red-600">{errorMessage}</p>
            <HorizontalLine />
            <div className="flex flex-row items-center justify-between">
              <p className="w-2/4 text-lg text-center font-bold">Name</p>
              <p className="w-1/4 text-lg text-center font-bold">Status</p>
              <p className="w-1/4 text-lg text-center font-bold">Updated at</p>
            </div>
            <div className="h-0 w-full border border-black mt-2"></div>
            {reservations.map((reservation) => {
              return (
                <div key={reservation.id}>
                  <div className="flex flex-row items-center justify-between h-12">
                    <div className="flex flex-row justify-center w-2/4">
                      <Link
                        href={`/reservations/${reservation.id}`}
                        className="text-center hover:text-yellow-500 duration-300 transition-colors"
                      >
                        {reservation.name}
                      </Link>
                    </div>
                    <p className="w-1/4 text-center">{reservation.status}</p>
                    <p className="w-1/4 text-center">
                      {new Date(reservation.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="h-0 w-full border"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SessionChecker>
  );
};

export default ReservationsPage;
