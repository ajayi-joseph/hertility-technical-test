export interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: string;
}