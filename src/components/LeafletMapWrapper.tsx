import dynamic from "next/dynamic";
import Loading from "./Loading";

const LeafletMapWrapper = dynamic(
  () => import("@/components/LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default LeafletMapWrapper;
