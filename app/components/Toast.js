export default function Toast({ message }) {
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm transition-all duration-300 z-50 ${message ? "translate-y-0 opacity-100" : "translate-y-[100px] opacity-0 pointer-events-none"}`}>
      {message}
    </div>
  );
}
