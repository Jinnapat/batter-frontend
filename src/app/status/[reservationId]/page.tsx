"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { Reservation } from "@/types/reservation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfluxDBClient } from "@influxdata/influxdb3-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const BatteryStatusPage = ({
  params,
}: {
  params: { reservationId: string };
}) => {
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

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

  // useEffect(() => {
  //   const createListener = async () => {
  //     const client = new InfluxDBClient({
  //       host: process.env.NEXT_PUBLIC_INFLUXDB_HOST as string,
  //       token: process.env.NEXT_PUBLIC_INFLUXDB_TOKEN as string,
  //     });
  //     console.log(client);
  //     // const query = `SELECT * FROM 'census' WHERE time >= now() - interval '24 hours' AND ('bees' IS NOT NULL OR 'ants' IS NOT NULL) order by time asc`;
  //     // const rows = client.query(query, "my-bucket");
  //     // console.log(rows);
  //     client.close();
  //   };
  //   createListener();
  // }, []);

  return (
    <SessionChecker jumpToIfUnauthenticated="/login">
      {isGettingReservationInfo && <Loading />}
      {!isGettingReservationInfo && !reservation && (
        <p>Cannot find information about this reservation</p>
      )}
      {!isGettingReservationInfo && reservation && (
        <div className="flex flex-col gap-3 max-w-2xl w-full">
          <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-10 bg-white">
            <div className="w-full">
              <Link
                href={`/reservations/${params.reservationId}`}
                className="hover:text-yellow-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
            <div className="w-full">
              <h1 className="font-bold text-4xl text-center">Battery Status</h1>
              <p className="text-center text-sm mb-3">
                see information about your battery in real-time.
              </p>
              <p className="text-sm text-center text-red-600">{errorMessage}</p>
              <HorizontalLine />
            </div>
          </div>
        </div>
      )}
    </SessionChecker>
  );
};

export default BatteryStatusPage;
