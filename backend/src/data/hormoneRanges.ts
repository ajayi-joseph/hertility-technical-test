export interface HormoneRange {
    min: number;
    max: number;
}

// Normal hormone ranges for status calculation
export const HORMONE_RANGES = {
    "AMH": { min: 7.14, max: 95 },
    "FT4": { min: 12, max: 22 },
    "PROL": { min: 102, max: 496 },
    "OEST": { min: 45, max: 854 },
    "FSH": { min: 6, max: 12.5 },
    "LH": { min: 2.4, max: 12.6 },
    "TEST": { min: 0.5, max: 2 },
    "SHBG": { min: 32.4, max: 128 }
} as const satisfies Record<string, HormoneRange>;

export type HormoneCode = keyof typeof HORMONE_RANGES;