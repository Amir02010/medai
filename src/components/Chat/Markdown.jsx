import React from "react";

/* ============================================================
   Мини-рендер markdown без зависимостей.
   Поддержка: **жирный**, _курсив_, • и - списки, заголовки,
   переносы строк. Никакого dangerouslySetInnerHTML.
   ============================================================ */

function inline(text, keyBase) {
  const nodes = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|_[^_]+_|`[^`]+`)/g;
  let last = 0;
  let m;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-i${i}`;
    i += 1;

    if (tok.startsWith("**") || tok.startsWith("__")) {
      nodes.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code key={key} className="md__code">
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function Markdown({ text = "" }) {
  const lines = String(text).split("\n");
  const blocks = [];
  let list = null;

  const flush = () => {
    if (list) {
      blocks.push(
        <ul className="md__list" key={`ul-${blocks.length}`}>
          {list.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>{inline(item, `l${blocks.length}-${i}`)}</li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const bullet = /^\s*[•\-*]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);

    if (bullet || numbered) {
      const content = (bullet || numbered)[1];
      if (!list) list = [];
      list.push(content);
      return;
    }

    flush();

    if (!line.trim()) return;

    const head = /^(#{1,4})\s+(.*)$/.exec(line);
    if (head) {
      blocks.push(
        <h4 className="md__h" key={`h-${idx}`}>
          {inline(head[2], `h${idx}`)}
        </h4>
      );
      return;
    }

    blocks.push(
      <p className="md__p" key={`p-${idx}`}>
        {inline(line, `p${idx}`)}
      </p>
    );
  });

  flush();
  return <div className="md">{blocks}</div>;
}
