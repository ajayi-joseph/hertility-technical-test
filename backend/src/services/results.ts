import { HORMONE_RANGES, HormoneCode } from "../data/hormoneRanges";

interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

interface OutOfRangeHormone {
    code: string;
    value: number;
    expectedMin: number;
    expectedMax: number;
    units: string;
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    status: string;
    outOfRangeHormones: OutOfRangeHormone[];
}

export function isHormoneInRange(hormoneCode: HormoneCode, value: number): boolean {
    const range = HORMONE_RANGES[hormoneCode];
    return value >= range.min && value <= range.max;
}

export function calculateResultStatus(hormoneResults: HormoneResults[]): string {
    if (hormoneResults.length === 0) return "UNKNOWN";
    
    const allInRange = hormoneResults.every(hormone => {
        if (!(hormone.code in HORMONE_RANGES)) return true;
        return isHormoneInRange(hormone.code as HormoneCode, hormone.value);
    });
    
    return allInRange ? "IN RANGE" : "NOT IN RANGE";
}

export function getOutOfRangeHormones(hormoneResults: HormoneResults[]): OutOfRangeHormone[] {
    return hormoneResults
        .filter(hormone => {
            if (!(hormone.code in HORMONE_RANGES)) return false;
            return !isHormoneInRange(hormone.code as HormoneCode, hormone.value);
        })
        .map(hormone => ({
            code: hormone.code,
            value: hormone.value,
            expectedMin: HORMONE_RANGES[hormone.code as HormoneCode].min,
            expectedMax: HORMONE_RANGES[hormone.code as HormoneCode].max,
            units: hormone.units
        }));
}

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Omit<Results, 'status' | 'outOfRangeHormones'>[] } = await import("../data/results.json", {
        assert: { type: "json" },
    });
    const rawResults = json.default;
    
    const resultsWithStatus = rawResults.map(result => ({
        ...result,
        status: calculateResultStatus(result.hormoneResults),
        outOfRangeHormones: getOutOfRangeHormones(result.hormoneResults)
    }));
    
    return resultsWithStatus;
}
