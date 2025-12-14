export type PizzaItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  type: number[];
  size: number[];
  rating: number;
};

export enum Status { 
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface PizzaSliseState {
  items: PizzaItem[];
  status: Status;
}