import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SectionNavigation from '@/components/home/SectionNavigation';
import sectionStyles from '@/components/home/SectionNavigation.module.css';
import SelectedPublications from '@/components/home/SelectedPublications';
import SelectedTeaching from '@/components/home/SelectedTeaching';
import News, { NewsItem } from '@/components/home/News';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';

import { Publication } from '@/types/publication';
import { BasePageConfig, PublicationPageConfig, TextPageConfig, CardPageConfig } from '@/types/page';

// Define types for section config
interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  description?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
}

type PageData =
  | { type: 'about', id: string, sections: SectionConfig[] }
  | { type: 'publication', id: string, config: PublicationPageConfig, publications: Publication[] }
  | { type: 'text', id: string, config: TextPageConfig, content: string }
  | { type: 'card', id: string, config: CardPageConfig };

const sectionLinks = [
  { sectionId: 'about', id: 'home-about', label: 'About' },
  { sectionId: 'featured_publications', id: 'home-publications', label: 'Selected Publications' },
  { sectionId: 'talks', id: 'home-talks', label: 'Talks' },
  { sectionId: 'selected_teaching', id: 'home-teaching', label: 'Teaching & Mentoring' },
  { sectionId: 'academic_services', id: 'home-services', label: 'Academic Service' },
];

function renderHomeSection(section: SectionConfig, enableOnePageMode = false) {
  switch (section.type) {
    case 'markdown':
      return section.id === 'selected_teaching' ? (
        <SelectedTeaching
          content={section.content || ''}
          title={section.title}
          enableOnePageMode={enableOnePageMode}
        />
      ) : (
        <About
          content={section.content || ''}
          title={section.title}
          listSpacingClassName={
            section.id === 'about' ? 'space-y-2.5' : 'space-y-0'
          }
          listTextClassName={section.id === 'about' ? 'text-[14px]' : undefined}
        />
      );
    case 'publications':
      return (
        <SelectedPublications
          publications={section.publications || []}
          title={section.title}
          description={section.description}
          enableOnePageMode={enableOnePageMode}
        />
      );
    case 'list':
      return (
        <News
          items={section.items || []}
          title={section.title}
        />
      );
    default:
      return null;
  }
}

export default function Home() {
  const config = getConfig();
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about');
  const researchInterests = (aboutConfig as { profile?: { research_interests?: string[] } })?.profile?.research_interests;

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]) => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown':
          return {
            ...section,
            content: section.source ? getMarkdownContent(section.source) : ''
          };
        case 'publications': {
          const bibtex = getBibtexContent('publications.bib');
          const allPubs = parseBibTeX(bibtex);
          const filteredPubs = section.filter === 'selected'
            ? allPubs.filter(p => p.selected)
            : allPubs;
          return {
            ...section,
            publications: filteredPubs.slice(0, section.limit || 5)
          };
        }
        case 'list': {
          const newsData = section.source ? getTomlContent<{ news: NewsItem[] }>(section.source) : null;
          return {
            ...section,
            items: newsData?.news || []
          };
        }
        default:
          return section;
      }
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  return (
    <div className={`${sectionStyles.homeLayout} max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-8 bg-background min-h-screen`}>
      {/* Main Content Grid */}
      <div className={`${sectionStyles.contentGrid} grid grid-cols-1 lg:grid-cols-[25fr_75fr] gap-20`}>

        {/* Left Column - Profile */}
        <div className={sectionStyles.profileColumn}>
          <Profile
            author={config.author}
            social={config.social}
            features={config.features}
            researchInterests={researchInterests}
          />
        </div>

        {/* Right Column - Content */}
        <div className={`${sectionStyles.contentColumn} min-w-0 space-y-8`}>
          <SectionNavigation items={sectionLinks} />
          {pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24 space-y-8">
              {page.type === 'about' && page.sections.map((section: SectionConfig) => (
                <div
                  key={section.id}
                  id={sectionLinks.find((link) => link.sectionId === section.id)?.id}
                  tabIndex={-1}
                  className={sectionStyles.sectionTarget}
                >
                  {renderHomeSection(section, enableOnePageMode)}
                </div>
              ))}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

