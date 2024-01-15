"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { Reservation } from "@/types/reservation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FluxTableMetaData, InfluxDB } from "@influxdata/influxdb-client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-3 sm:p-10 bg-white">
      <h2 className="text-center">{title}</h2>
      {data.length == 0 && (
        <p className="text-sm mt-5 text-red-700">No Recent Data</p>
      )}
      {data.length > 0 && (
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
      )}
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
  const [isGettingInfluxDBData, setIsGettingInfluxDBData] =
    useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalConsumptions, setTotalConsumptions] = useState<number[]>([]);
  const [powerOutputs, setPowerOutputs] = useState<number[]>([]);

  const powerOutputsRef = useRef<number[]>([]);
  const totalConsumptionsRef = useRef<number[]>([]);
  const labelsRef = useRef<string[]>([]);
  const lastDateRef = useRef<Date>();

  const getInfluxDBData = async () => {
    powerOutputsRef.current = [];
    totalConsumptionsRef.current = [];
    labelsRef.current = [];
    lastDateRef.current = undefined;

    const url = process.env.NEXT_PUBLIC_INFLUXDB_HOST as string;
    const token = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN as string;
    const org = process.env.NEXT_PUBLIC_INFLUXDB_ORG as string;

    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
    const fluxQuery =
      'from(bucket: "Batter") |> range(start: -8h) |> filter(fn: (r) => r._measurement == "W" and r.entity_id == "modbus_inverter_power" and r._field == "value")';

    queryApi.queryRows(fluxQuery, {
      next: (row: string[], tableMeta: FluxTableMetaData) => {
        const o = tableMeta.toObject(row);
        const date = new Date(o._time);
        const power = parseInt(o._value);
        if (!lastDateRef.current) {
          totalConsumptionsRef.current.push(0);
          setTotalConsumptions(totalConsumptionsRef.current);
        } else {
          const dif = (date.valueOf() - lastDateRef.current.valueOf()) / 1000;
          totalConsumptionsRef.current.push(
            totalConsumptionsRef.current[
              totalConsumptionsRef.current.length - 1
            ] +
              power * dif
          );
          setTotalConsumptions(totalConsumptionsRef.current);
        }
        powerOutputsRef.current.push(power);
        labelsRef.current.push(date.toLocaleString());
        setPowerOutputs(powerOutputsRef.current);
        setLabels(labelsRef.current);
        lastDateRef.current = date;
      },
      error: (error: Error) => {
        setErrorMessage(error.message);
      },
      complete: () => {
        setIsGettingInfluxDBData(false);
      },
    });
  };

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
    setInterval(() => {
      getInfluxDBData();
    }, 3000);
    getInfluxDBData();
  }, [params]);

  return (
    <SessionChecker jumpToIfUnauthenticated="/login">
      {(isGettingReservationInfo || isGettingInfluxDBData) && <Loading />}
      {!isGettingReservationInfo && !isGettingInfluxDBData && !reservation && (
        <p>Cannot find information about this reservation</p>
      )}
      {!isGettingReservationInfo && !isGettingInfluxDBData && reservation && (
        <div className="flex flex-col gap-6 max-w-2xl w-full">
          <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-5 sm:p-10 bg-white">
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
            title="Power Output"
            labels={labels}
            data={powerOutputs}
            borderColor="rgb(192, 75, 192)"
          />
          <LineChartWithTitle
            title="Total Consumption"
            labels={labels}
            data={totalConsumptions}
            borderColor="rgb(192, 192, 75)"
          />
        </div>
      )}
    </SessionChecker>
  );
};

export default BatteryStatusPage;
