import React from 'react';
import { X, Check, Copy, Code2, FolderTree, BookOpen, Layers, Terminal } from 'lucide-react';

interface IntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationGuideModal: React.FC<IntegrationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Architecture & Integration Specification</h2>
            <p className="text-xs text-muted-foreground">shadcn/ui structure, Tailwind CSS, TypeScript, and AnalyticsBento</p>
          </div>
        </div>

        <div className="mt-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Section 1: Default path /components/ui */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between font-semibold text-foreground text-sm mb-1.5">
              <span className="flex items-center gap-1.5">
                <FolderTree className="size-4 text-emerald-500" />
                Default Path: /components/ui
              </span>
              <span className="text-[10px] font-mono rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Why /components/ui is essential:</strong> The official shadcn/ui CLI conventions designate <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">/components/ui</code> as the standard namespace for reusable, unstyled primitives (buttons, dialogs, cards, bento grids). This isolates low-level atomic UI components from domain business logic, allows automated updates via <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">npx shadcn add &lt;component&gt;</code>, and prevents merge conflicts.
            </p>
            <div className="mt-2.5 rounded-lg border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
              📁 /components/ui/analytics-bento.tsx (copied & active)<br />
              📁 /components/ui/demo.tsx (pure demo view)<br />
              📁 /lib/utils.ts (cn class merging utility)
            </div>
          </div>

          {/* Section 2: Setup Commands */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between font-semibold text-foreground text-sm mb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="size-4 text-purple-500" />
                CLI Setup Commands
              </span>
              <button
                onClick={() => handleCopy("npx shadcn@latest init --defaults", "cmd")}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {copiedSection === "cmd" ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                {copiedSection === "cmd" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="rounded-lg bg-background p-2.5 font-mono text-[11px] text-foreground overflow-x-auto border border-border">
{`# 1. Initialize shadcn with defaults (skips interactive prompts):
npx shadcn@latest init --defaults

# 2. Add standard primitives if needed:
npx shadcn add button card dialog dropdown-menu

# 3. Path alias in tsconfig.json & vite.config.ts:
"@/*": ["./*"]`}
            </pre>
          </div>

          {/* Section 3: Component Analysis & Implementation Q&A */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Layers className="size-4 text-blue-500" />
              Answers to Integration Questions
            </div>
            
            <div className="space-y-2">
              <div>
                <strong className="text-foreground">1. What data/props are passed to AnalyticsBento?</strong>
                <p className="text-muted-foreground mt-0.5">
                  Live calculated income & revenue series (30 days), hourly activity waves (desktop vs mobile / business vs personal), categories breakdown with squarified Treemap and comparison table, and 12-month seasonality radar chart.
                </p>
              </div>

              <div>
                <strong className="text-foreground">2. Are there specific state management requirements?</strong>
                <p className="text-muted-foreground mt-0.5">
                  The dashboard maintains transaction history, simulated bank feeds (Chase, Mercury, Stripe, Brex), active filter criteria, currency conversions, and dark/light mode CSS classes.
                </p>
              </div>

              <div>
                <strong className="text-foreground">3. Are there any required assets (images, icons)?</strong>
                <p className="text-muted-foreground mt-0.5">
                  Pure vector SVG rendering inside <code className="font-mono">AnalyticsBento</code> without external heavy charting libraries. Feather/Lucide icons for bank institutions and transaction indicators.
                </p>
              </div>

              <div>
                <strong className="text-foreground">4. What is the expected responsive behavior?</strong>
                <p className="text-muted-foreground mt-0.5">
                  Full 12-column responsive Bento grid: On mobile (&lt;1024px), cards stack vertically. On desktops (≥1024px), revenue (5 cols) + sessions (7 cols), categories (7 cols) + seasonality (5 cols).
                </p>
              </div>

              <div>
                <strong className="text-foreground">5. What is the best place to use this component?</strong>
                <p className="text-muted-foreground mt-0.5">
                  As the primary visual intelligence hub at the heart of the dashboard, fed by the automated transaction stream and connected bank balances.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
};
