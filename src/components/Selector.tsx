import { useState } from "react";
import Loading from "./Loading";
import Image from "next/image";

const Selector = ({
  value,
  onChange,
  isLoading,
}: {
  value: string;
  onChange: (selected: string) => Promise<void>;
  isLoading?: boolean;
}) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const listOfStatus = ["pending", "delivering", "active", "done"];

  const getStatusColor = (status: string) => {
    if (status == "pending") return "bg-orange-600";
    if (status == "delivering") return "bg-blue-600";
    if (status == "active") return "bg-green-600";
    if (status == "done") return "bg-gray-600";
    return "bg-gray-700";
  };

  return (
    <div className="w-full max-w-40">
      <button
        className={`${getStatusColor(
          value
        )} rounded-full px-3 w-full flex flex-row items-center justify-center hover:text-yellow-200 transition-colors duration-300 text-white`}
        onClick={() => setShowDropDown(!showDropDown)}
        disabled={isLoading}
      >
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <p className="w-full text-center">{value}</p>
            <Image src="/icon/down.png" alt="icon" width={10} height={10} />
          </>
        )}
      </button>
      <div
        className={
          "w-full transition-all duration-300 origin-top h-0 translate-y-1" +
          (showDropDown ? "" : " scale-y-0 opacity-0")
        }
      >
        <div className="flex flex-col gap-1 w-full z-50 relative bg-gray-500 rounded-lg">
          {listOfStatus.map((status) => (
            <button
              key={status}
              className="z-50 rounded-lg p-3 hover:bg-black text-white"
              onClick={async () => {
                setShowDropDown(false);
                onChange(status);
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selector;
