import {NextRequest, NextResponse} from "next/server";
import {stationSummaryRepository} from "@/lib/repositories/stationSummaryRepository";
import {stopRepository} from "@/lib/repositories/stopRepository";
import {stopChangeRepository} from "@/lib/repositories/stopChangeRepository";
import {ucStopSummary} from "@/lib/uc/ucStopSummary";

export async function GET(request: NextRequest, {params}: { params: Promise<{ dateString: string, eva: string }> },) {
    const {dateString, eva: evaString} = await params;

    const eva = parseInt(evaString);
    const yymmdd = iso8601ToYYMMDD(dateString);
    const summary = await ucStopSummary.getAllForStationAndDate(eva, yymmdd);
    console.log(summary.length)
    return NextResponse.json(summary);
}

function iso8601ToDate(yyyymmdd: string) {
    if (yyyymmdd.length != 10) {
        throw new Error("Not a valid date string");
    }

    const year = Number(yyyymmdd.slice(0, 4));
    const month = Number(yyyymmdd.slice(5, 7))
    const day = Number(yyyymmdd.slice(8, 10));
    console.log(year, month, day);
    return new Date(year, month, day);
}

function iso8601ToYYMMDD(isodate: string) {
    if (isodate.length != 10) {
        throw new Error("Not a valid date string");
    }

    return isodate.replaceAll('-', '').substring(2);
}