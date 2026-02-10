import {DateRangePicker, Form, type RangeValue} from "@heroui/react";
import {parseAbsoluteToLocal, type ZonedDateTime} from "@internationalized/date";
import React, {FormEvent} from "react";
import {Button} from "@heroui/button";

type MapFilterProps = {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function MapFilter({ onSubmit }: MapFilterProps) {
    const [date, setDate] = React.useState<RangeValue<ZonedDateTime> | null>(() => {
        const now = parseAbsoluteToLocal(new Date().toISOString());
        return { start: now, end: now };
    });
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