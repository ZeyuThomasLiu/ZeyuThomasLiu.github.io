import type { Publication } from '@/types/publication';

export function getPublicationAnchor(publication: Publication): string {
  return 'publication-' + publication.title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Match the full page's published/preprint sections, never the selected subset.
export function getPublicationReferences(publications: Publication[]) {
  let publishedNumber = 0;
  let preprintNumber = 0;
  return new Map(publications.map(publication => {
    const isPreprint = typeof publication.order === 'number' && publication.order < 0;
    return [publication.id, {
      number: isPreprint ? ++preprintNumber : ++publishedNumber,
      anchor: getPublicationAnchor(publication),
      title: publication.title,
    }] as const;
  }));
}

export function resolvePublicationCitations(markdown: string, publications: Publication[]): string {
  const references = getPublicationReferences(publications);
  // Sort each comma-separated citation group on its line, keeping other text in place.
  return markdown.replace(/\[@[^\]]+\](?:[ \t]*,[ \t]*\[@[^\]]+\])*/g, group => {
    const citedReferences = [...group.matchAll(/\[@([^\]]+)\]/g)].map(([, key]) => {
      const reference = references.get(key);
      if (!reference) throw new Error('Unknown publication citation: ' + key);
      return reference;
    });

    return citedReferences
      .sort((a, b) => a.number - b.number)
      .map(reference => {
        const title = reference.title.replace(/"/g, "'");
        return `[[${reference.number}]](/publications/#${reference.anchor} "${title}")`;
      })
      .join(', ');
  });
}
