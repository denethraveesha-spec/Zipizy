self.onmessage = (
  event: MessageEvent<{ pattern: string; text: string; flags: string }>,
) => {
  try {
    const { pattern, text, flags } = event.data;
    const regex = new RegExp(pattern, flags);
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    let truncated = false;
    while ((match = regex.exec(text)) !== null) {
      if (matches.length === 1000) {
        truncated = true;
        break;
      }
      matches.push(match);
      if (!regex.global) break;
      if (match[0] === "") {
        const point = text.codePointAt(regex.lastIndex);
        regex.lastIndex +=
          regex.unicode && point !== undefined && point > 0xffff ? 2 : 1;
      }
    }
    self.postMessage({ matches, truncated });
  } catch (error) {
    self.postMessage({ error: "Invalid pattern: " + (error as Error).message });
  }
};
