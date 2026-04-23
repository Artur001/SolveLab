"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

export function MathDisplay({ math, block = false }: MathDisplayProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (e) {
      return math;
    }
  }, [math, block]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
