import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Hello World</h1>
      <div className="flex gap-4">
        <Link href="/teachers">
          <Button variant="secondary">View Teachers</Button>
        </Link>
        <Link href="/courses">
          <Button variant="secondary">View Courses</Button>
        </Link>
      </div>
    </div>
  );
}
