'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
    title?: string;
    listSpacingClassName?: string;
}

export default function About({
    content,
    title = 'About',
    listSpacingClassName,
}: AboutProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2 className="text-xl font-serif font-bold text-primary mb-2">{title}</h2>
            <div className="text-sm text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-[17px] font-serif text-primary mt-2 mb-1 border-b border-neutral-200 dark:border-neutral-800 pb-1">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => (
                            <ul
                                className={`markdown-ul list-disc list-outside pl-5 mb-4 ${
                                listSpacingClassName ?? 'space-y-1'
                                }`}
                            >
                                {children}
                            </ul>
                            ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-outside pl-5 mb-4 space-y-1">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => <li className="pl-1 text-[15px]">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-sm transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                            />
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
        </motion.section>
    );
}
