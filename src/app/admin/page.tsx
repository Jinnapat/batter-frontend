"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { Reservation } from "@/types/reservation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const AdminManagementPage = () => {
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const reservationsRef = useRef<Reservation[]>([]);

  useEffect(() => {
    supabaseClient
      .from("reservations")
      .select()
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
  }, []);

  return (
    <SessionChecker
      jumpToIfUnauthenticated="/login"
      jumpToIfNotAdmin="/reservations"
    >
      {isGettingReservationInfo && <Loading />}
      {!isGettingReservationInfo && (
        <div className="w-full flex flex-col items-center max-w-2xl gap-3 shadow-lg rounded-2xl p-5 sm:p-10 bg-white">
          <div className="w-full">
            <h1 className="font-bold text-4xl text-center">
              Reservations Management
            </h1>
            <p className="text-center text-sm mb-3">
              see and manage all reservations in the system.
            </p>
            <p className="text-sm text-center text-red-600">{errorMessage}</p>
            <HorizontalLine />
            <div className="flex flex-row items-center justify-between">
              <p className="w-8/12 text-lg text-center font-bold sm:w-2/4">
                Name
              </p>
              <p className="w-1/4 text-lg text-center font-bold">Status</p>
              <p className="w-1/4 text-lg text-center font-bold hidden sm:block">
                Updated at
              </p>
            </div>
            <div className="h-0 w-full border border-black mt-2"></div>
            {reservations.length == 0 && (
              <p className="text-center py-10">No reservations</p>
            )}
            {reservations.map((reservation) => {
              return (
                <div key={reservation.id}>
                  <div className="flex flex-row items-center justify-between py-4">
                    <div className="flex flex-row justify-center w-8/12 sm:w-2/4">
                      <Link
                        href={`/admin/reservation/${reservation.id}`}
                        className="text-center hover:text-yellow-500 duration-300 transition-colors break-words w-full"
                      >
                        {reservation.name}
                      </Link>
                    </div>
                    <p className="w-1/4 text-center">{reservation.status}</p>
                    <p className="w-1/4 text-center hidden sm:block">
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

export default AdminManagementPage;
