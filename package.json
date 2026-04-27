import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'sankalp_hrms_db';
const STORE_NAME = 'sync_queue';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addToSyncQueue(data: any) {
  const db = await initDB();
  return db.add(STORE_NAME, { ...data, timestamp: new Date().toISOString() });
}

export async function getSyncQueue() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function removeFromSyncQueue(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
