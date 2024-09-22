"use client";

import { SchedulingOrder as SchedulingOrderType } from "@prisma/client";
import SchedulingOrder from "../SchedulingOrder";

export const GeneralOptions = ({
  schedulingOrder,
}: {
  schedulingOrder: SchedulingOrderType;
}) => {
  return (
    <>
      <SchedulingOrder defaultValue={schedulingOrder} />
    </>
  );
};
