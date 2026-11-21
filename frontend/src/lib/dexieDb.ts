import Dexie, { type Table } from 'dexie';

export interface CachedMandiPrice {
  id?: number;
  crop: string;
  mandiId: string;
  mandiName: string;
  distanceKm: number;
  pricePerQuintal: number;
  grade: string;
  shelfLifeHours: number;
  lastUpdated: string; // ISO
}

export interface QueuedQuery {
  id?: number;
  timestamp: string;
  audioDurationSeconds: number;
  transcript: string;
  crop?: string;
  quantityKg?: number;
  status: 'pending' | 'synced';
}

export interface CachedAlert {
  id?: number;
  crop: string;
  targetMandi: string;
  thresholdPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  active: boolean;
}

export class FasalRouteDB extends Dexie {
  prices!: Table<CachedMandiPrice, number>;
  queuedQueries!: Table<QueuedQuery, number>;
  alerts!: Table<CachedAlert, number>;

  constructor() {
    super('FasalRouteDB');
    this.version(1).stores({
      prices: '++id, crop, mandiId, lastUpdated',
      queuedQueries: '++id, status, timestamp',
      alerts: '++id, crop, active',
    });
  }
}

export const db = new FasalRouteDB();
