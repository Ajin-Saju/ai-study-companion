export default function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-3xl border border-[#EDE9F7] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#6B647F]">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${color ?? "text-[#211F36]"}`}>{value}</p>
    </div>
  );
}
