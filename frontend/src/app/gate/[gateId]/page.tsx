import { Layout } from "@/components/Layout";
import Zones from "@/components/zones/zones";
import React from "react";

const page = () => {
  return (
    <Layout title="Parking Zones">
      <div className="flex flex-col gap-4 p-4">
        <Zones />
      </div>
    </Layout>
  );
};

export default page;
