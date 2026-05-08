import { T } from "../lib/i18n";

export default function TypoPreview({ heading, body, lang }) {
  const t = T[lang];
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs text-gray-400 uppercase min-w-[60px]">{t.typoHeading}</span>
        <span className="text-2xl font-medium" style={{ fontFamily: `'${heading}', serif` }}>{t.typoSample}</span>
        <span className="text-xs text-gray-400 text-right">{heading}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-gray-400 uppercase min-w-[60px]">{t.typoBody}</span>
        <span className="text-[15px] leading-relaxed text-gray-500 flex-1 mx-4" style={{ fontFamily: `'${body}', sans-serif` }}>{t.typoBodySample}</span>
        <span className="text-xs text-gray-400 text-right">{body}</span>
      </div>
    </div>
  );
}
