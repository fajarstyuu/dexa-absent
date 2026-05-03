import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-background/60 text-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Layout siap dipakai</h1>
        <p className="text-sm text-muted-foreground">
          Sidebar di kiri, konten utama di kanan, dan header kecil di atas.
        </p>
      </div>
      <Button>Action</Button>
    </div>
  );
}

export default App;
