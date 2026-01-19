export interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface OutOfRangeHormone {
  code: string;
  value: number;
  expectedMin: number;
  expectedMax: number;
  units: string;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: string;
  outOfRangeHormones: OutOfRangeHormone[];
}