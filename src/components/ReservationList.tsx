import { Reservation } from "@/types/reservation";
import Link from "next/link";
import StatusTag from "./StatusTag";

const ReservationList = ({
  reservations,
  jumpPrefix,
}: {
  reservations: Reservation[];
  jumpPrefix: string;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="w-8/12 text-lg text-center font-bold">Name</p>
        <p className="w-4/12 sm:w-1/4 text-lg text-center font-bold">Status</p>
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
              <div className="flex flex-row justify-center w-8/12">
                <Link
                  href={jumpPrefix + reservation.id}
                  className="text-center hover:text-yellow-500 duration-300 transition-colors break-words w-full"
                >
                  {reservation.name}
                </Link>
              </div>
              <div className="w-4/12 sm:w-1/4">
                <StatusTag status={reservation.status} />
              </div>
              <p className="w-1/4 text-center hidden sm:block">
                {new Date(reservation.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="h-0 w-full border"></div>
          </div>
        );
      })}
    </>
  );
};

export default ReservationList;
