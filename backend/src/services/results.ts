import { HORMONE_RANGES, HormoneCode } from "../data/hormoneRanges";

interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    status: string;
}

function isHormoneInRange(hormoneCode: HormoneCode, value: number): boolean {
    const range = HORMONE_RANGES[hormoneCode];
    return value >= range.min && value <= range.max;
}

function calculateResultStatus(hormoneResults: HormoneResults[]): string {
    if (hormoneResults.length === 0) return "UNKNOWN";
    
    const allInRange = hormoneResults.every(hormone => {
        // Skip unknown hormone codes
        if (!(hormone.code in HORMONE_RANGES)) return true;
        return isHormoneInRange(hormone.code as HormoneCode, hormone.value);
    });
    
    return allInRange ? "IN RANGE" : "NOT IN RANGE";
}

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Omit<Results, 'status'>[] } = await import("../data/results.json", {
        assert: { type: "json" },
    });
    const rawResults = json.default;
    
    const resultsWithStatus = rawResults.map(result => ({
        ...result,
        status: calculateResultStatus(result.hormoneResults)
    }));
    
    return resultsWithStatus;
}
