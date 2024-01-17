"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import ReservationList from "@/components/ReservationList";
import SessionChecker from "@/components/SessionChecker";
import StatusTag from "@/components/StatusTag";
import supabaseClient from "@/supabase/client";
import { Reservation } from "@/types/reservation";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ReservationsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const reservationsRef = useRef<Reservation[]>([]);

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
        reservationsRef.current = response.data;
        setReservations(response.data);
        setIsGettingReservationInfo(false);
      });
    supabaseClient
      .channel("room1")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reservations",
          filter: `owner_id=eq.${user.id}`,
        },
        (payload) => {
          const nextReservations = reservationsRef.current.map((reservation) =>
            reservation.id != payload.old.id
              ? reservation
              : (payload.new as Reservation)
          );
          reservationsRef.current = nextReservations;
          setReservations(nextReservations);
        }
      )
      .subscribe();
  }, [user]);

  return (
    <SessionChecker jumpToIfUnauthenticated="/login" setUser={setUser}>
      {isGettingReservationInfo && <Loading />}
      {!isGettingReservationInfo && (
        <div className="w-full flex flex-col items-center max-w-2xl gap-3 shadow-lg rounded-2xl p-5 sm:p-10 bg-white">
          <div className="w-full">
            <h1 className="font-bold text-4xl text-center">
              Your Reservations
            </h1>
            <p className="text-center text-sm mb-3">
              see status of your current reservations
            </p>
            <p className="text-sm text-center text-red-600">{errorMessage}</p>
            <HorizontalLine />
            <ReservationList
              reservations={reservations}
              jumpPrefix="/reservations/"
            />
          </div>
        </div>
      )}
    </SessionChecker>
  );
};

export default ReservationsPage;
