export const wordCount = (content: string) => {
  return content.split(/\s+/).filter((element) => element != '').length;
};
