import Image from 'next/image';

export default function BaoliuPage() {
  // Put your 15 images in /public/baoliu/ with these exact filenames.
  const photos = [
    '/baoliu/baoliu1.jpg',
    '/baoliu/baoliu2.jpg',
    '/baoliu/baoliu3.jpg',
    '/baoliu/baoliu4.jpg',
    '/baoliu/baoliu5.jpg',
    '/baoliu/baoliu6.jpg',
    '/baoliu/baoliu7.jpg',
    '/baoliu/baoliu8.jpg',
    '/baoliu/baoliu9.jpg',
    '/baoliu/baoliu10.jpg',
    '/baoliu/baoliu11.jpg',
    '/baoliu/baoliu12.jpg',
    '/baoliu/baoliu13.jpg',
    '/baoliu/baoliu14.jpg',
    '/baoliu/baoliu15.jpg',
  ];

  return (
    <main className="max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-primary mb-3">Baoliu</h1>
      <div className="text-medium text-neutral-600 dark:text-neutral space-y-1 mb-5">
        <p>
          Hello, dear human! I&apos;m Baoliu (where &quot;bao&quot; sounds like the first syllable of
          &quot;bowing&quot;, the action of bending forward, pronounced like &quot;bau&quot;). Thanks
          for hopping by!
        </p>
        <p>
          If you have any questions for me, just hop over to my agent, Zeyu, and he&apos;ll help you
          out!
        </p>
      </div>

      {/* 3 per row on large screens, aligned squares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <div
            key={src}
            className="relative w-full aspect-square overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
          >
            <Image
              src={src}
              alt={`Baoliu photo ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
              priority={i < 6}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
