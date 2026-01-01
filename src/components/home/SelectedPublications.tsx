'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
  publications: Publication[];
  title?: string;
  description?: string;
  enableOnePageMode?: boolean;
}

export default function SelectedPublications({
  publications,
  title = 'Selected Publications',
  description,
  enableOnePageMode = false,
}: SelectedPublicationsProps) {
  const publishedPublications = publications.filter((p) => {
    const o = p.order;
    return o === undefined || o === null || Number(o) >= 0;
  });

  const preprintPublications = publications.filter((p) => {
    const o = p.order;
    return o !== undefined && o !== null && Number(o) < 0;
  });

  const showPreprints = preprintPublications.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-2"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-serif font-bold text-primary">{title}</h2>

        {!enableOnePageMode && (
          <Link
            href="/publications"
            className="text-sm text-accent hover:underline underline-offset-4"
          >
            View All →
          </Link>
        )}
      </div>

      {description ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed max-w-none, mb-2.5">
          {description}
        </p>
      ) : null}

      {/* Published */}
      {showPreprints && (
        <h3 className="text-[15px] font-semibold text-primary mt-2">
          Published
        </h3>
      )}

      <div className="space-y-2.5">
        {publishedPublications.map((pub, index) => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-2"
          >
            <div className="flex gap-1.5">
              {/* Counter column */}
              <span
                className="w-8 text-neutral-400 font-normal select-none text-center flex-shrink-0"
                aria-hidden="true"
              >
                [{index + 1}]
              </span>

              {/* Content column */}
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-semibold text-primary leading-snug">
                  {pub.title}
                </h3>

                <div className="text-[13.5px] text-neutral-600 dark:text-neutral-400">
                  {pub.authors.map((author, idx) => (
                    <span key={idx}>
                      <span
                        className={`${author.isHighlighted ? 'font-semibold text-accent-opposite' : ''} 
                        ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}
                      >
                        {author.name}
                      </span>
                      {author.isCorresponding && <sup>†</sup>}
                      {idx < pub.authors.length - 1 && ', '}
                    </span>
                  ))}
                </div>

                {/* Conference + year */}
                <div className="flex items-center gap-2 text-[12.7px] font-medium text-neutral-800 dark:text-neutral-600">
                  <span>
                    {pub.journal || pub.conference} {` • ${pub.year}`}
                  </span>

                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-1 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                    >
                      URL
                    </a>
                  )}
                </div>
              </div>
            </div>

            {pub.description ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-2">
                {pub.description}
              </p>
            ) : null}
          </motion.div>
        ))}
      </div>

      {/* Preprints (only if exists) */}
      {showPreprints && (
        <>
          <h3 className="text-[15px] font-semibold text-primary mt-3">
            Preprints
          </h3>

          <div className="space-y-2.5">
            {preprintPublications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-2"
              >
                <div className="flex gap-1.5">
                  {/* Counter column (restart for preprints) */}
                  <span
                    className="w-8 text-neutral-400 font-normal select-none text-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    [{index + 1}]
                  </span>

                  {/* Content column */}
                  <div className="space-y-0.5">
                    <h3 className="text-[15px] font-semibold text-primary leading-snug">
                      {pub.title}
                    </h3>

                    <div className="text-[13.5px] text-neutral-600 dark:text-neutral-400">
                      {pub.authors.map((author, idx) => (
                        <span key={idx}>
                          <span
                            className={`${author.isHighlighted ? 'font-semibold text-accent-opposite' : ''} 
                            ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}
                          >
                            {author.name}
                          </span>
                          {author.isCorresponding && <sup>†</sup>}
                          {idx < pub.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>

                    {/* Venue + Preprint • year */}
                    <div className="flex items-center gap-2 text-[12.7px] font-medium text-neutral-800 dark:text-neutral-600">
                      <span>
                        {(pub.journal || pub.conference)
                          ? `${pub.journal || pub.conference}  `
                          : ''}
                        {`Preprint • ${pub.year}`}
                      </span>

                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-1 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                        >
                          URL
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {pub.description ? (
                  <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-2">
                    {pub.description}
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
