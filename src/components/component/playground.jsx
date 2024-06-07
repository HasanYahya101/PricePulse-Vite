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

function LinuxTimestamptoMonth(timestamp) {
    let date = new Date(timestamp * 1000);
    let month = date.getMonth();    // 0-11
    let year = date.getFullYear(); // YYYY
    let monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(date); // Jan, Feb, Mar, ...
    return { month, year, monthName };
}

export function Playground() {

    const { toast } = useToast();

    const [check, setCheck] = useState(false);

    const [testData, setTestData] = useState("");

    useEffect(() => {
        toast({
            title: "Warning",
            description: "There is a hard limit of 250 requests per month for the free version of the API. Please don't exceed this limit. If it is exceeded, you won't be able to use the API for the rest of the month.",
        });
    }, []);


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

    const [longName, setLongName] = useState("NULL");
    const [symbol, setSymbol] = useState("NULL");
    const [price, setPrice] = useState("NULL");
    const [marketcap, setMarketcap] = useState("NULL");
    const [fiftyTwoWeekHigh, setFiftyTwoWeekHigh] = useState("NULL");
    const [fiftyTwoWeekLow, setFiftyTwoWeekLow] = useState("NULL");

    const [month1, setMonth1] = useState('');
    const [month2, setMonth2] = useState('');
    const [month3, setMonth3] = useState('');
    const [month4, setMonth4] = useState('');
    const [month5, setMonth5] = useState('');
    const [month6, setMonth6] = useState('');

    const [data1high, setData1High] = useState(0);
    const [data1low, setData1Low] = useState(0);
    const [data2high, setData2High] = useState(0);
    const [data2low, setData2Low] = useState(0);
    const [data3high, setData3High] = useState(0);
    const [data3low, setData3Low] = useState(0);
    const [data4high, setData4High] = useState(0);
    const [data4low, setData4Low] = useState(0);
    const [data5high, setData5High] = useState(0);
    const [data5low, setData5Low] = useState(0);
    const [data6high, setData6High] = useState(0);
    const [data6low, setData6Low] = useState(0);

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

        const url = `https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=${testData}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'b37f4bf8f6mshb21067d56d51b07p112cd6jsn90e370560ac1',
                'x-rapidapi-host': 'yh-finance.p.rapidapi.com'
            }
        };

        var response = null;
        var result = null;

        try {
            response = await fetch(url, options);
            result = await response.text();
            console.log("res", result);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch data",
                variant: "destructive"
            })
            return;
        }
        const JSONResponse = JSON.parse(result);
        console.log("JSON", JSONResponse);

        const quoteType = JSONResponse.quoteType;
        const priceData = JSONResponse.price;
        const summarydetail = JSONResponse.summaryDetail;

        setLongName(quoteType.longName);
        setSymbol(quoteType.symbol);
        setPrice(priceData.regularMarketPrice.fmt);
        setMarketcap(priceData.marketCap.fmt);
        setFiftyTwoWeekHigh(summarydetail.fiftyTwoWeekHigh.fmt);
        setFiftyTwoWeekLow(summarydetail.fiftyTwoWeekLow.fmt);

        // now for historic data
        const _url = `https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data?symbol=${testData}`;
        const _options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'b37f4bf8f6mshb21067d56d51b07p112cd6jsn90e370560ac1',
                'x-rapidapi-host': 'yh-finance.p.rapidapi.com'
            }
        };

        var _response = null;
        var _result = null;

        try {
            _response = await fetch(_url, _options);
            _result = await _response.text();
            console.log(_result);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch data",
                variant: "destructive"
            })
            return;
        }

        const _JSONResponse = JSON.parse(_result);
        console.log("_JSON", _JSONResponse);

        var _prices = _JSONResponse.prices;

        setMonth1(LinuxTimestamptoMonth(_prices[0].date).monthName);
        setMonth2(LinuxTimestamptoMonth(_prices[32].date).monthName);
        setMonth3(LinuxTimestamptoMonth(_prices[64].date).monthName);
        setMonth4(LinuxTimestamptoMonth(_prices[96].date).monthName);
        setMonth5(LinuxTimestamptoMonth(_prices[128].date).monthName);
        setMonth6(LinuxTimestamptoMonth(_prices[160].date).monthName);

        var _month1 = _prices[0];
        var _month2 = _prices[30];
        var _month3 = _prices[61];
        var _month4 = _prices[92];
        var _month5 = _prices[123];
        var _month6 = _prices[154];

        setData1High(_month1.high);
        setData1Low(_month1.low);
        setData2High(_month2.high);
        setData2Low(_month2.low);
        setData3High(_month3.high);
        setData3Low(_month3.low);
        setData4High(_month4.high);
        setData4Low(_month4.low);
        setData5High(_month5.high);
        setData5Low(_month5.low);
        setData6High(_month6.high);
        setData6Low(_month6.low);

        if (result.hasOwnProperty("Error Message")) {
            toast({
                title: "Error: Invalid stock ID",
                description: "Please enter a valid stock ID",
                variant: "destructive"
            })
            return;
        }

        if (_result.hasOwnProperty("Error Message")) {
            toast({
                title: "Error: Invalid stock ID",
                description: "Please enter a valid stock ID",
                variant: "destructive"
            })
            return;
        }

        toast({
            title: "Success",
            description: "Stock ID found",
            variant: "success"
        })

        setOpen(true);

        return;
    }

    return (
        <Dialog className="w-full max-w-2xl" open={open} onClose={() => setOpen(false)} onOpenChange={(open) => setOpen(open)}
        >
            <div className="w-full flex justify-end">
                <Button onClick={Clicked}
                    className="mt-6 w-full">Search</Button>
            </div>
            <DialogContent>
                <Card className="w-full max-w-2xl mt-4">
                    <CardHeader className="flex items-center justify-between gap-4 pb-4">
                        <div className="grid gap-1">
                            <div className="text-lg font-semibold">{longName}</div>
                            <div
                                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>${price}</span>
                                <span
                                    className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 text-xs font-medium">
                                    {symbol}
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
                                    <div className="font-medium">${price}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">52-Week Range</div>
                                    <div className="font-medium">${fiftyTwoWeekHigh} - ${fiftyTwoWeekLow}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Market Cap</div>
                                    <div className="font-medium">${marketcap}</div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <LineChart className="aspect-[9/4]" month1={month1} month2={month2} month3={month3} month4={month4} month5={month5} month6={month6}
                                    data1high={data1high} data1low={data1low} data2high={data2high} data2low={data2low}
                                    data3high={data3high} data3low={data3low} data4high={data4high} data4low={data4low}
                                    data5high={data5high} data5low={data5low} data6high={data6high} data6low={data6low}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogClose />
        </Dialog>
    );
}

function LineChart({ month1, month2, month3, month4, month5, month6, data1high, data1low, data2high, data2low, data3high, data3low, data4high, data4low, data5high, data5low, data6high, data6low }) {
    const [maxY, setMaxY] = useState(0);
    const [minY, setMinY] = useState(0);

    useEffect(() => {
        const highData = [data1high, data2high, data3high, data4high, data5high, data6high];
        const lowData = [data1low, data2low, data3low, data4low, data5low, data6low];

        const maxY_ = Math.max(...highData) + 5;
        const minY_ = Math.min(...lowData) - 5;

        setMaxY(maxY_);
        setMinY(minY_);
    }, [data1high, data1low, data2high, data2low, data3high, data3low, data4high, data4low, data5high, data5low, data6high, data6low]);
    const { toast } = useToast();
    return (
        (<div className="aspect-[9/4]">
            <ResponsiveLine
                data={[
                    {
                        id: "Desktop",
                        data: [
                            { x: month6, y: data6high },
                            { x: month5, y: data5high },
                            { x: month4, y: data4high },
                            { x: month3, y: data3high },
                            { x: month2, y: data2high },
                            { x: month1, y: data1high },
                        ],
                    },
                    {
                        id: "Mobile",
                        data: [
                            { x: month6, y: data6low },
                            { x: month5, y: data5low },
                            { x: month4, y: data4low },
                            { x: month3, y: data3low },
                            { x: month2, y: data2low },
                            { x: month1, y: data1low },
                        ],
                    },
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{
                    type: "point",
                }}
                yScale={{
                    type: "linear",
                    min: minY, max: maxY,
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