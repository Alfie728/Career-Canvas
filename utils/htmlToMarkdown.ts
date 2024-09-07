export function convertHtmlToMarkdown(html: string): string {
  // This is a simple conversion. For a more robust solution, consider using a library like turndown.
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<u>(.*?)<\/u>/g, '__$1__')
    .replace(/<[^>]+>/g, '');
}

export function convertHtmlToPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}