import { DatabaseZap } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center gap-4">
      <DatabaseZap className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">
          Data Stream
        </h1>
        <p className="text-muted-foreground">
          Realtime database analysis and visualization.
        </p>
      </div>
    </div>
  );
}
