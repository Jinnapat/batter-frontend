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
import {
  Chart,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const LineChartWithTitle = ({
  title,
  labels,
  data,
  borderColor,
}: {
  title: string;
  labels: string[];
  data: number[];
  borderColor: string;
}) => {
  return (
    <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-10 bg-white">
      <h2 className="text-center">{title}</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              fill: false,
              borderColor,
              tension: 0.5,
            },
          ],
        }}
      />
    </div>
  );
};

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
  const [batteryVoltages, setBatteryVoltages] = useState<number[]>([]);
  const [totalConsumptions, setTotalConsumptions] = useState<number[]>([]);
  const [powerOutputs, setPowerOutputs] = useState<number[]>([]);

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

  useEffect(() => {
    setTimeout(() => {
      const voltage = Math.random() + 12.0;
      const power = Math.random() + 1.0;
      const nextBatteryVoltages = [...batteryVoltages, voltage];
      const nextPowerOutputs = [...powerOutputs, power];
      const lastTotalConsumption = totalConsumptions.at(-1);
      const nextTotalConsumption = [
        ...totalConsumptions,
        lastTotalConsumption != undefined
          ? lastTotalConsumption + power
          : power,
      ];
      const nextLabels = [...labels, new Date().toLocaleTimeString()];
      if (nextLabels.length > 10) {
        setBatteryVoltages(nextBatteryVoltages.slice(1));
        setPowerOutputs(nextPowerOutputs.slice(1));
        setTotalConsumptions(nextTotalConsumption.slice(1));
        setLabels(nextLabels.slice(1));
        return;
      }
      setBatteryVoltages(nextBatteryVoltages);
      setPowerOutputs(nextPowerOutputs);
      setTotalConsumptions(nextTotalConsumption);
      setLabels(nextLabels);
    }, 2000);
  }, [batteryVoltages, labels, powerOutputs, totalConsumptions]);

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
        <div className="flex flex-col gap-6 max-w-2xl w-full">
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
          <LineChartWithTitle
            title="Battery Voltage"
            labels={labels}
            data={batteryVoltages}
            borderColor="rgb(75, 192, 192)"
          />
          <LineChartWithTitle
            title="Total Consumption"
            labels={labels}
            data={totalConsumptions}
            borderColor="rgb(192, 192, 75)"
          />
          <LineChartWithTitle
            title="Power Output"
            labels={labels}
            data={powerOutputs}
            borderColor="rgb(192, 75, 192)"
          />
        </div>
      )}
    </SessionChecker>
  );
};

export default BatteryStatusPage;
