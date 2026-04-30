export default function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 900 320"
        className="w-full h-auto min-w-[700px]"
        role="img"
        aria-label="Architecture flow: User uploads image, processed by CNN and Gemini in parallel, ensembled, then a decision is made"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* Boxes */}
        {/* USER */}
        <g>
          <rect x="20" y="130" width="120" height="60" rx="10" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
          <text x="80" y="158" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">USER</text>
          <text x="80" y="176" textAnchor="middle" className="fill-muted-foreground text-[10px]">Citizen / Officer</text>
        </g>

        {/* UPLOAD */}
        <g>
          <rect x="180" y="130" width="140" height="60" rx="10" className="fill-secondary stroke-border" strokeWidth="1.5" />
          <text x="250" y="158" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">UPLOAD IMAGE</text>
          <text x="250" y="176" textAnchor="middle" className="fill-muted-foreground text-[10px]">+ Location (lat/lng)</text>
        </g>

        {/* CNN (top) */}
        <g>
          <rect x="370" y="50" width="160" height="70" rx="10" className="fill-accent stroke-border" strokeWidth="1.5" />
          <text x="450" y="78" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">CNN</text>
          <text x="450" y="95" textAnchor="middle" className="fill-muted-foreground text-[11px]">MobileNetV2</text>
          <text x="450" y="110" textAnchor="middle" className="fill-muted-foreground text-[10px]">in-browser (TF.js)</text>
        </g>

        {/* Gemini (bottom) */}
        <g>
          <rect x="370" y="200" width="160" height="70" rx="10" className="fill-accent stroke-border" strokeWidth="1.5" />
          <text x="450" y="228" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">GEMINI VISION</text>
          <text x="450" y="245" textAnchor="middle" className="fill-muted-foreground text-[11px]">Vision Transformer</text>
          <text x="450" y="260" textAnchor="middle" className="fill-muted-foreground text-[10px]">edge function</text>
        </g>

        {/* ENSEMBLE */}
        <g>
          <rect x="580" y="130" width="150" height="60" rx="10" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
          <text x="655" y="158" textAnchor="middle" className="fill-foreground text-[13px] font-semibold">ENSEMBLE</text>
          <text x="655" y="176" textAnchor="middle" className="fill-muted-foreground text-[10px]">0.35·CNN + 0.65·Gemini</text>
        </g>

        {/* DECISION */}
        <g>
          <rect x="770" y="130" width="120" height="60" rx="10" className="fill-primary stroke-primary" strokeWidth="1.5" />
          <text x="830" y="158" textAnchor="middle" className="fill-primary-foreground text-[13px] font-semibold">DECISION</text>
          <text x="830" y="176" textAnchor="middle" className="fill-primary-foreground/80 text-[10px]">≥ 0.4 → Cleanup</text>
        </g>

        {/* Arrows */}
        <line x1="140" y1="160" x2="178" y2="160" className="stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Upload → CNN (split up) */}
        <path d="M320,150 Q345,150 345,90 L368,85" className="fill-none stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Upload → Gemini (split down) */}
        <path d="M320,170 Q345,170 345,235 L368,235" className="fill-none stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* CNN → Ensemble */}
        <path d="M530,85 L555,85 Q578,85 578,150" className="fill-none stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Gemini → Ensemble */}
        <path d="M530,235 L555,235 Q578,235 578,170" className="fill-none stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Ensemble → Decision */}
        <line x1="730" y1="160" x2="768" y2="160" className="stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
      </svg>
    </div>
  );
}
