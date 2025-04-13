import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layout/PageContainer";
import TextHeader from "@/components/PageHeaders/TextHeader";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailsOfShift from "./components/DetailsOfShift";
import { useToast } from "@/hooks/use-toast";
import { core_sheduling_detailed_schedules_read } from "@/apis/shifts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Shift Scheduling", link: "/dashboard/shift-scheduling" },
  { title: "Shift Details", link: "/dashboard/shift-scheduling/shift-details" },
];

const ShiftDetails = () => {
  const { id } = useParams();
  const [shifts, setShifts] = useState(null);
  const { toast } = useToast();

  const featchDetails = async () => {
    try {
      const res = await core_sheduling_detailed_schedules_read(id);
      if (res.status === 200) {
        console.log(res.data);
        setShifts(res.data);
      } else {
        toast({
          title: "Error!",
          description: "Failed to fetch outfits",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: "Error!",
        description: "Failed to fetch outfits",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    featchDetails();
  }, []);

  if (!shifts) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title="Shift Details"
          description="View details of a shift"
        />
        <DetailsOfShift 
          shift={shifts}
          featchDetails={featchDetails}
        />
      </div>
    </PageContainer>
  );
};

export default ShiftDetails;
