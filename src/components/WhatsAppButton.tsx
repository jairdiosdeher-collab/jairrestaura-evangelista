import { PASTOR_WHATSAPP_URL } from '../constants/pastoral';

export function WhatsAppOfficialIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.353.615 4.651 1.784 6.678L2.667 29.333l6.817-1.747a13.28 13.28 0 0 0 6.52 1.71c7.363 0 13.33-5.973 13.33-13.292 0-7.364-5.967-13.337-13.33-13.337Zm0 24.336a10.98 10.98 0 0 1-5.598-1.531l-.401-.238-4.046 1.037 1.081-3.947-.261-.416a10.96 10.96 0 0 1-1.682-5.844c0-6.069 4.938-11.007 11.007-11.007 6.068 0 10.999 4.938 10.999 11.007 0 6.068-4.931 10.939-11.099 10.939Zm6.038-8.248c-.33-.165-1.957-.966-2.26-1.076-.303-.11-.523-.165-.744.165-.22.33-.854 1.076-1.047 1.296-.193.22-.386.248-.716.083-.33-.165-1.396-.515-2.658-1.641-.983-.876-1.646-1.958-1.839-2.288-.193-.33-.02-.509.145-.674.149-.148.33-.386.496-.579.165-.193.22-.33.33-.551.11-.22.055-.413-.027-.578-.083-.165-.744-1.793-1.019-2.454-.268-.644-.541-.557-.744-.567-.192-.01-.413-.012-.633-.012-.22 0-.578.083-.881.413-.303.33-1.157 1.131-1.157 2.757 0 1.627 1.185 3.199 1.35 3.419.165.22 2.332 3.562 5.65 4.994.79.341 1.406.544 1.886.697.792.252 1.514.216 2.084.131.636-.095 1.957-.8 2.232-1.572.275-.772.275-1.434.193-1.572-.083-.138-.303-.22-.633-.385Z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <a
        href={PASTOR_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con el Pastor Jair por WhatsApp"
        className="group inline-flex items-center gap-2.5 bg-[#0F7B43] hover:bg-[#0B6335] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg border border-[#25D366]/40 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F7B43]"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#25D366] text-[#052E16] shrink-0">
          <WhatsAppOfficialIcon className="w-4 h-4" />
        </span>
        <span className="whitespace-nowrap tracking-wide">HABLAR CON EL PASTOR JAIR</span>
      </a>
    </div>
  );
}
