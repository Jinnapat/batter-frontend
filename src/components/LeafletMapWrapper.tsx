import dynamic from "next/dynamic";

const LeafletMapWrapper = dynamic(
  () => import("@/components/LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => <p>loading...</p>,
  }
);

export default LeafletMapWrapper;
