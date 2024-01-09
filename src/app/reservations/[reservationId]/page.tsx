"use client";

import SessionChecker from "@/components/SessionChecker";
import { useEffect, useState } from "react";
import supabaseClient from "@/supabase/client";
import Loading from "@/components/Loading";
import HorizontalLine from "@/components/HorizontalLine";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LeafletMapWrapper from "@/components/LeafletMapWrapper";
import "leaflet/dist/leaflet.css";
import { Reservation } from "@/types/reservation";
import MainButton from "@/components/MainButton";

const InfoSlot = ({ title, value }: { title: string; value: string }) => {
  return (
    <>
      <div className="flex flex-row items-center">
        <p className="w-1/3">{title}</p>
        <p className="w-2/3 text-wrap">{value}</p>
      </div>
      <div className="h-0 w-full border my-3"></div>
    </>
  );
};

const ReservationInfoPage = ({
  params,
}: {
  params: { reservationId: string };
}) => {
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    supabaseClient
      .from("reservations")
      .select()
      .eq("id", params.reservationId)
      .then((response) => {
        if (response.error) {
          setErrorMessage(response.error.message);
          return;
        }
        setReservation(response.data[0]);
        setIsGettingReservationInfo(false);
      });
  }, [params]);

  return (
    <SessionChecker jumpToIfUnauthenticated="/login">
      {isGettingReservationInfo && <Loading />}
      {!isGettingReservationInfo && reservation && (
        <div className="flex flex-col gap-3 max-w-2xl w-full">
          <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-10 bg-white">
            <div className="w-full">
              <Link
                href="/reservations"
                className="hover:text-yellow-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
            <div className="w-full">
              <h1 className="font-bold text-4xl text-center">
                Reservation Info
              </h1>
              <p className="text-center text-sm mb-3">
                see information about this reservation
              </p>
              <p className="text-sm text-center text-red-600">{errorMessage}</p>
              <HorizontalLine />
              <InfoSlot title="Event Name" value={reservation.name} />
              <InfoSlot title="Description" value={reservation.description} />
              <InfoSlot
                title="Start"
                value={new Date(reservation.start).toLocaleString()}
              />
              <InfoSlot
                title="End"
                value={new Date(reservation.end).toLocaleString()}
              />
              <InfoSlot title="Status" value={reservation.status} />
              <InfoSlot
                title="Last Status Update"
                value={new Date(reservation.updated_at).toLocaleString()}
              />
              {reservation.status == "active" && (
                <>
                  <br></br>
                  <Link href={`/status/${params.reservationId}`}>
                    <MainButton>CHECK STATUS</MainButton>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="shadow-lg rounded-2xl p-5 bg-white w-full flex flex-col gap-3">
            <p className="text-center">
              Location: {reservation.lat}, {reservation.lng}
            </p>
            <LeafletMapWrapper lat={reservation.lat} lng={reservation.lng} />
            <p className="text-center text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}
    </SessionChecker>
  );
};

export default ReservationInfoPage;
