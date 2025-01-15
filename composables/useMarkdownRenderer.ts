export const useMarkdownRenderer = () => {
  const preserveWhitespace = (content: string) => {
    return content.replace(/^\s+/gm, (match) => match);
  };

  const processInlineStyles = (content: string) => {
    return content;
  };

  return {
    preserveWhitespace,
    processInlineStyles,
  };
};
