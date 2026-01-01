'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    // Extract unique years and types for filters
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    // Filter publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    // === NEW: split into Published vs Preprints by sign of `order` ===
    // Preprints: `order < 0`
    // Published: everything else (positive order, zero, or missing order)
    const publishedPublications = useMemo(() => {
        return filteredPublications.filter(pub => !(typeof pub.order === 'number' && pub.order < 0));
    }, [filteredPublications]);

    const preprintPublications = useMemo(() => {
        return filteredPublications.filter(pub => (typeof pub.order === 'number' && pub.order < 0));
    }, [filteredPublications]);

    function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
        return (
            <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.03 * index }}
                className="bg-white dark:bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
                <div className="flex flex-col md:flex-row gap-3">
                    {pub.preview && (
                        <div className="w-full md:w-48 flex-shrink-0">
                            <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                <Image
                                    src={`/papers/${pub.preview}`}
                                    alt={pub.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex-grow">
                        <div className="flex gap-3">
                            {/* fixed-width index column */}
                            <div className="w-6 flex-shrink-0">
                                <div
                                    className="inline-flex w-6 justify-center text-neutral-400 font-normal select-none"
                                    aria-hidden="true"
                                >
                                    [{index + 1}]
                                </div>
                            </div>

                            {/* content column */}
                            <div className="min-w-0 flex-grow">
                                <h3 className={`${embedded ? "text-base" : "text-base"} font-semibold text-primary mb-1 leading-tight`}>
                                    {pub.title}
                                </h3>

                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-[1px]">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span
                                                className={`${author.isHighlighted ? 'font-semibold text-accent-opposite' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}
                                            >
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent-opposite' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px]">
                                    <span className="font-medium text-neutral-800 dark:text-neutral-600">
                                        {typeof pub.order === 'number' && pub.order < 0 && (
                                            <>Preprint</>
                                        )}
                                        {pub.journal || pub.conference} {` • ${pub.year}`}
                                    </span>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.url && (
                                            <a
                                                href={pub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                URL
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                Code
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                    expandedAbstractId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                                Abstract
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors",
                                                    expandedBibtexId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <BookOpenIcon className="h-3 w-3 mr-1.5" />
                                                BibTeX
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedAbstractId === pub.id && pub.abstract ? (
                                        <motion.div
                                            key="abstract"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-4"
                                        >
                                            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                                <p className="text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed">
                                                    {pub.abstract}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : null}

                                    {expandedBibtexId === pub.id && pub.bibtex ? (
                                        <motion.div
                                            key="bibtex"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-4"
                                        >
                                            <div className="relative bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                                <pre className="text-xs text-neutral-600 dark:text-neutral-500 overflow-x-auto whitespace-pre-wrap font-mono">
                                                    {pub.bibtex}
                                                </pre>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(pub.bibtex || '');
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-500 hover:text-accent shadow-sm border border-neutral-200 dark:border-neutral-600 transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    function SectionHeader({ title }: { title: string }) {
        return (
            <div className="pt-3 pb-1">
                <h2 className="text-lg font-serif font-bold text-primary">
                    {title}
                </h2>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-3">
                <h1 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-bold text-primary mb-1`}>
                    {config.title}
                </h1>
                {config.description && (
                    <p className={`${embedded ? "text-sm" : "text-sm"} text-neutral-600 dark:text-neutral-500 max-w-none`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls (currently disabled in your codebase) */}
            {false && (
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search publications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200",
                                showFilters
                                    ? "bg-accent text-white border-accent"
                                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent"
                            )}
                        >
                            <FunnelIcon className="h-5 w-5 mr-2" />
                            Filters
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1" /> Year
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedYear('all')}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-full transition-colors",
                                                    selectedYear === 'all'
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                All
                                            </button>
                                            {years.map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => setSelectedYear(year)}
                                                    className={cn(
                                                        "px-3 py-1 text-xs rounded-full transition-colors",
                                                        selectedYear === year
                                                            ? "bg-accent text-white"
                                                            : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                    )}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                            <BookOpenIcon className="h-4 w-4 mr-1" /> Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedType('all')}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-full transition-colors",
                                                    selectedType === 'all'
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                All
                                            </button>
                                            {types.map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type)}
                                                    className={cn(
                                                        "px-3 py-1 text-xs rounded-full capitalize transition-colors",
                                                        selectedType === type
                                                            ? "bg-accent text-white"
                                                            : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                    )}
                                                >
                                                    {type.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Publications */}
            <div className="space-y-2">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        No publications found matching your criteria.
                    </div>
                ) : (
                    <>
                        {/* Published section */}
                        <SectionHeader title="Published" />
                        {publishedPublications.map((pub, index) => (
                            <PublicationCard key={pub.id} pub={pub} index={index} />
                        ))}

                        {/* Preprints section (only if any) */}
                        {preprintPublications.length > 0 && (
                            <>
                                <SectionHeader title="Preprints" />
                                {preprintPublications.map((pub, index) => (
                                    <PublicationCard key={pub.id} pub={pub} index={index} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
