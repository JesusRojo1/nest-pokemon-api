export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: PokeResponse[];
}

export interface PokeResponse {
  name: string;
  url: string;
}
