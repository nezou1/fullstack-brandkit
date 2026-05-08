export default function SectionHeader({ label, scheme }) {
  return (
    <div className="px-3 py-1.5 text-xs uppercase tracking-widest font-medium rounded-t-lg"
      style={{ background: scheme.primary_button_background + "12", color: scheme.primary_button_background, borderBottom: `1px solid ${scheme.border}` }}>
      {label}
    </div>
  );
}
