"use client";
import { title } from "@/components/primitives";
import {BasicMap} from "@/app/map/components/BasicMap";
import MapFilter from "@/app/map/components/MapFilter";
import React from "react";

export default function AboutPage() {
    const [submitted, setSubmitted] = React.useState<{ startDate: FormDataEntryValue | null; endDate: FormDataEntryValue | null } | null>(null);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const startDate = formData.get("startDate");
        const endDate = formData.get("endDate");
        setSubmitted({ startDate, endDate });
    }

  return (
      <section className="flex flex-col items-center justify-center gap-4">
          <h1 className={title()}>Deutschlandkarte</h1>
          <MapFilter onSubmit={onSubmit}/>
          <BasicMap width={1000} height={700}/>
      </section>
  );
}
