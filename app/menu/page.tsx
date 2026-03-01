import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface MenuItem {
  day: string;
  date: string;
  menu: string;
}

export default function MenuPage() {
  let menuItems: MenuItem[] = [];
  let error: string | null = null;

  try {
    const filePath = path.join(process.cwd(), "public", "lunch_menu.json");
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      menuItems = JSON.parse(fileContents);
    } else {
      error = "Menu data not found. Please run the scraper first.";
    }
  } catch (e) {
    error = "Error loading menu data.";
  }

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Weekly Hot Lunch Menu
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        $6.50 per meal
      </p>

      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}</p>
          <p className="text-sm text-yellow-700 mt-2">
            Run: <code className="bg-yellow-100 px-2 py-1 rounded">python3 scripts/scrape_menu.py</code>
          </p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800">No menu items found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.day}
                </h3>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <p className="text-gray-700">{item.menu}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
