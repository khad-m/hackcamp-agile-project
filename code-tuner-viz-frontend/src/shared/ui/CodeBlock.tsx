import React from "react";
import Prism from "prismjs";

import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-sql";

type Props = {
  code: string;
  language?: "json" | "typescript" | "sql";
};

export function CodeBlock({ code, language = "json" }: Props) {
  const html = React.useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages.plain;
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  return (
    <pre style={{ margin: 0, overflowX: "auto", borderRadius: 12, padding: 12, background: "#f6f6f6" }}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
