'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={embedded ? "" : "mx-full"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-2xl"} font-serif font-bold text-primary mb-2`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-base"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="markdown text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 id={String(children) === 'Research Mentoring' ? 'research-mentoring' : undefined} className="text-xl font-serif font-bold text-primary mt-5 mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-[13.5pt] font-semibold text-primary mt-2 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-6 mb-1 space-y-1">
                            {children}
                        </ul>
                        ),
                        ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-6 mb-1 space-y-1">
                            {children}
                        </ol>
                        ),
                        li: ({ children }) => <li className="leading-relaxed mb-0">{children}</li>,
                        a: ({ href, title, children }) => (
                            <a
                                href={href}
                                title={title}
                                target={href?.startsWith('http') ? '_blank' : undefined}
                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-link-text font-medium hover:underline transition-colors"
                            >
                                {children}
                            </a>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
