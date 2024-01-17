const StatusTag = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    if (status == "pending") return "bg-orange-600";
    if (status == "delivering") return "bg-blue-600";
    if (status == "active") return "bg-green-600";
    if (status == "done") return "bg-gray-600";
    return "bg-gray-700";
  };
  return (
    <div
      className={`${getStatusColor(
        status
      )} rounded-full px-3 w-full transition-colors duration-300 text-white text-center text-sm`}
    >
      {status}
    </div>
  );
};

export default StatusTag;
