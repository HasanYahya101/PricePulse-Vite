import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveLine } from "@nivo/line"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { DialogTrigger, DialogContent, DialogDescription, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { set } from "date-fns";

function getKey(str) {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
        newStr += String.fromCharCode(str.charCodeAt(i) - 1);
    }
    return newStr;
}

const TWELVE_DATA_API_KEY = getKey("dg:366183g9c5fg69gec9c:3e31655g4");

export function Playground() {

    const { toast } = useToast();

    const [check, setCheck] = useState(false);

    const [testData, setTestData] = useState("");


    return (
        <div className="flex justify-center max-h-[70vh]">
            <Toaster />
            <Card className="w-full max-w-[79vh] mt-20">
                <CardHeader className="flex items-left justify-between gap-4 pb-4">
                    <div className="grid gap-1">
                        <div className="justify-left text-lg font-semibold">Stock Lookup</div>
                        <div
                            className="justify-left flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                            Enter a company stock ID to get details (For example: AAPL, TSLA, MSFT)
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock ID</label>
                    <Input value={testData} onChange={(e) => setTestData(e.target.value)}
                        className="pr-[120px]" placeholder="Enter stock ID" />
                </CardContent>
                <CardFooter>
                    <div className="flex-1">
                        <div className="justify-left items-center flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Checkbox id="terms" htmlFor="terms" checked={check}
                                onClick={() => setCheck(!check)}
                                className="mr-2 ml-2" />
                            By clicking search, you agree to our terms and conditions
                        </div>
                        <GraphData check={check} testData={testData} setTestData={setTestData} setCheck={setCheck}
                        />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

function GraphData({ check, testData, setTestData, setCheck }) {

    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("NULL");

    async function Clicked() {
        if (check !== true) {
            toast({
                title: "Error",
                description: "Please agree to the terms and conditions",
                variant: "destructive"
            })
            return;
        }
        else if (testData === "") {
            toast({
                title: "Error",
                description: "Please enter a stock ID",
                variant: "destructive"
            })
            return;
        }
        let query = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${testData}&apikey=W03MYKLGQ6H6GS5F`
        let response = await fetch(query);
        let data = await response.json();
        if (data.hasOwnProperty("Error Message")) {
            toast({
                title: "Error: Invalid stock ID",
                description: "Please enter a valid stock ID",
                variant: "destructive"
            })
            return;
        }
        console.log(data);
        toast({
            title: "Success",
            description: "Stock ID found",
            variant: "success"
        })

        let mats = [];
        let dates = [];
        let open = [];
        let high = [];
        let low = [];
        let close = [];
        let volume = [];
        for (const [key, value] of Object.entries(data["Monthly Adjusted Time Series"])) {
            mats.push(value);
            dates.push(key);
        }
        mats.forEach((element) => {
            open.push(element["1. open"]);
            high.push(element["2. high"]);
            low.push(element["3. low"]);
            close.push(element["4. close"]);
            volume.push(element["6. volume"]);
        });
        console.log(dates);
        console.log(open);
        console.log(high);
        console.log(low);
        console.log(close);
        console.log(volume);

        // get current date in format YYYY-MM-DD
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        while (dd.length < 2) {
            dd = '0' + dd;
        }
        while (mm.length < 2) {
            mm = '0' + mm;
        }
        while (yyyy.length < 4) {
            yyyy = '0' + yyyy;
        }

        // now get the last 6 months of data
        let last6Months = [];
        let last6MonthsDates = [];
        let last6MonthsOpen = [];
        let last6MonthsHigh = [];
        let last6MonthsLow = [];
        let last6MonthsClose = [];
        let last6MonthsVolume = [];
        for (let i = 0; i < 6; i++) {
            last6Months.push(mats[i]);
            last6MonthsDates.push(dates[i]);
            last6MonthsOpen.push(open[i]);
            last6MonthsHigh.push(high[i]);
            last6MonthsLow.push(low[i]);
            last6MonthsClose.push(close[i]);
            last6MonthsVolume.push(volume[i]);
        }
        console.log("6dates", last6MonthsDates);
        console.log("6open", last6MonthsOpen);
        console.log("6high", last6MonthsHigh);
        console.log("6low", last6MonthsLow);
        console.log("6close", last6MonthsClose);
        console.log("6volume", last6MonthsVolume);

        // get the last 6 months of data
        let last6MonthsDatahigh = [];
        let last6MonthsDatalow = [];
        let last6MonthsDataclose = [];
        let last6MonthsDatavolume = [];
        for (let i = 0; i < 6; i++) {
            last6MonthsDatahigh.push({ x: last6MonthsDates[i], y: last6MonthsHigh[i] });
            last6MonthsDatalow.push({ x: last6MonthsDates[i], y: last6MonthsLow[i] });
            last6MonthsDataclose.push({ x: last6MonthsDates[i], y: last6MonthsClose[i] });
            last6MonthsDatavolume.push({ x: last6MonthsDates[i], y: last6MonthsVolume[i] });
        }

        let new_query = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${testData}&apikey=W03MYKLGQ6H6GS5F`;
        let new_response = await fetch(new_query);
        let new_data = await new_response.json();
        console.log("new_data", new_data);

        let _dates = Object.keys(new_data["Time Series (Daily)"]).map(date => new Date(date));
        let currentDate = new Date();
        let closestDate = _dates.reduce((a, b) => Math.abs(b - currentDate) < Math.abs(a - currentDate) ? b : a);
        let closestDateString = closestDate.toISOString().split('T')[0];
        console.log("closestDateString", closestDateString);
        let current_price = new_data["Time Series (Daily)"][closestDateString][`4. close`];
        console.log("current_price", current_price);

        let query__ = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${testData}&apikey=W03MYKLGQ6H6GS5F`;
        let response__ = await fetch(query__);
        let data__ = await response__.json();
        console.log("data__", data__);

        let name = data__["Name"];
        setName(name);
        console.log("name", name);
        let _52_week_high_ = data__["52WeekHigh"];
        let _52_week_low_ = data__["52WeekLow"];
        let market_cap_ = data__["MarketCapitalization"];

        setOpen(true);

        return;
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="w-full max-w-2xl"
        >
            <div className="w-full flex justify-end">
                <Button onClick={Clicked}
                    className="mt-6 w-full">Search</Button>
            </div>
            <DialogContent>
                <Card className="w-full max-w-2xl mt-4">
                    <CardHeader className="flex items-center justify-between gap-4 pb-4">
                        <div className="grid gap-1">
                            <div className="text-lg font-semibold">{name}</div>
                            <div
                                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>$159.24</span>
                                <span
                                    className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-xs font-medium">
                                    {testData}
                                </span>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Stock Price</div>
                                    <div className="font-medium">$159.24</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">52-Week Range</div>
                                    <div className="font-medium">$120.67 - $176.42</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Market Cap</div>
                                    <div className="font-medium">$2.57T</div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <LineChart className="aspect-[9/4]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

function LineChart(props) {
    return (
        (<div {...props}>
            <ResponsiveLine
                data={[
                    {
                        id: "Desktop",
                        data: [
                            { x: "Jan", y: 43 },
                            { x: "Feb", y: 137 },
                            { x: "Mar", y: 61 },
                            { x: "Apr", y: 145 },
                            { x: "May", y: 26 },
                            { x: "Jun", y: 154 },
                        ],
                    },
                    {
                        id: "Mobile",
                        data: [
                            { x: "Jan", y: 60 },
                            { x: "Feb", y: 48 },
                            { x: "Mar", y: 177 },
                            { x: "Apr", y: 78 },
                            { x: "May", y: 96 },
                            { x: "Jun", y: 204 },
                        ],
                    },
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{
                    type: "point",
                }}
                yScale={{
                    type: "linear",
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 5,
                    tickPadding: 16,
                }}
                colors={["#2563eb", "#e11d48"]}
                pointSize={6}
                useMesh={true}
                gridYValues={6}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                role="application" />
        </div>)
    );
}

function ChevronRightIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>)
    );
}