'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './SectionNavigation.module.css';

interface SectionLink {
  id: string;
  label: string;
}

export default function SectionNavigation({ items }: { items: SectionLink[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const pendingScrollFrame = useRef<number | null>(null);
  const navigationTarget = useRef<string | null>(null);

  useEffect(() => {
    let frame = 0;
    navigationTarget.current = window.location.hash.slice(1) || null;

    const updateActiveSection = () => {
      frame = 0;
      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => section !== null);
      const offset = window.matchMedia('(min-width: 1024px)').matches ? 112 : 96;
      const target = sections.find((section) => section.id === navigationTarget.current);
      const targetBounds = target?.getBoundingClientRect();
      const targetVisible = targetBounds && targetBounds.bottom > offset && targetBounds.top < window.innerHeight;
      // Short sections can become active when fully visible, even near the page end.
      const current = targetVisible ? target : sections.filter((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= offset + 2 || bounds.bottom <= window.innerHeight - 2;
      }).at(-1) ?? sections[0];
      if (current) setActiveId(current.id);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    const cancelPendingScroll = () => {
      if (pendingScrollFrame.current !== null) {
        window.cancelAnimationFrame(pendingScrollFrame.current);
        pendingScrollFrame.current = null;
      }
    };
    const releaseNavigationTarget = () => {
      navigationTarget.current = null;
      cancelPendingScroll();
      scheduleUpdate();
    };
    const handleScrollKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement &&
          (event.target.isContentEditable || event.target.matches('input, textarea, select'))) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        releaseNavigationTarget();
      }
    };
    const handleHistoryChange = () => {
      cancelPendingScroll();
      navigationTarget.current = window.location.hash.slice(1) || null;
      scheduleUpdate();
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('wheel', releaseNavigationTarget, { passive: true });
    window.addEventListener('touchstart', releaseNavigationTarget, { passive: true });
    window.addEventListener('keydown', handleScrollKey);
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', handleHistoryChange);
    window.addEventListener('popstate', handleHistoryChange);
    return () => {
      window.cancelAnimationFrame(frame);
      cancelPendingScroll();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('wheel', releaseNavigationTarget);
      window.removeEventListener('touchstart', releaseNavigationTarget);
      window.removeEventListener('keydown', handleScrollKey);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', handleHistoryChange);
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={styles.navigation}>
      <p className={styles.label}>On this page</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              scroll={false}
              onNavigate={() => {
                navigationTarget.current = item.id;
                if (pendingScrollFrame.current !== null) {
                  window.cancelAnimationFrame(pendingScrollFrame.current);
                }
                const scrollAfterNavigation = () => {
                  // Let Next save the departure position before moving the viewport.
                  if (window.location.hash !== `#${item.id}`) {
                    pendingScrollFrame.current = window.requestAnimationFrame(scrollAfterNavigation);
                    return;
                  }
                  pendingScrollFrame.current = null;
                  const target = document.getElementById(item.id);
                  target?.focus({ preventScroll: true });
                  target?.scrollIntoView({ block: 'start' });
                  setActiveId(item.id);
                };
                pendingScrollFrame.current = window.requestAnimationFrame(scrollAfterNavigation);
              }}
              aria-current={activeId === item.id ? 'location' : undefined}
              className={styles.link}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
