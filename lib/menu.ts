import { sql } from "@/lib/db";

export interface MenuItem {
  day: string;
  date: string;
  menu: string;
}

const DAY_ORDER: Record<string, number> = {
  Mon: 1,
  Tues: 2,
  Wed: 3,
  Thurs: 4,
  Fri: 5,
};

export async function getMenuItems(): Promise<MenuItem[]> {
  const rows = await sql`
    SELECT day, date, menu
    FROM menu
    ORDER BY updated_at DESC
    LIMIT 5
  `;
  const items = rows as MenuItem[];
  items.sort((a, b) => (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99));
  return items;
}
