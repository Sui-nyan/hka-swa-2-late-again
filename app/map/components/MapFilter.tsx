"use client";
import {DateRangePicker, Form, type RangeValue} from "@heroui/react";
import {parseAbsoluteToLocal, type ZonedDateTime} from "@internationalized/date";
import React from "react";
import {Button} from "@heroui/button";


export default function MapFilter() {
    const [date, setDate] = React.useState<RangeValue<ZonedDateTime> | null>(() => {
        const now = parseAbsoluteToLocal(new Date().toISOString());
        return { start: now, end: now };
    });
    const [submitted, setSubmitted] = React.useState<{ startDate: FormDataEntryValue | null; endDate: FormDataEntryValue | null } | null>(null);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const startDate = formData.get("startDate");
        const endDate = formData.get("endDate");
        setSubmitted({ startDate, endDate });
    }
    return (
        <Form className="flex flex-row gap-4 items-end mb-4" onSubmit={onSubmit}>
            <DateRangePicker
                fullWidth
                label="Wähle den Zeitraum"
                value={date}
                hourCycle={24}
                granularity="hour"
                onChange={(v) => setDate(v)}
            />
            <Button type="submit" variant="bordered">
                Filtern
            </Button>
        </Form>
    );
}