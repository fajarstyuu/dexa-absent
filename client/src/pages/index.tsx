import { AbsentCard } from "@/components/Home/absent-card";
import { AbsentTableHome } from "@/components/Home/absent-table";

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col p-4 items-center gap-4 rounded-xl border border-dashed bg-background/60 text-center">
      <AbsentCard />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">History Absensi</h1>
        <p className="text-sm text-muted-foreground">
          Riwayat absensi anda selama 10 hari terakhir. Semangat bekerja dan
          tetap produktif!
        </p>
      </div>
      <AbsentTableHome />
    </div>
  );
}

export default HomePage;
