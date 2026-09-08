const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61583311850224";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/chris-scarborough-937b5812a/";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy px-6 py-10 text-sm text-white/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-white">
            WellCommand Assurance
          </p>
          <p>1708 Spring Green Blvd Ste. 120 #131</p>
          <a href="tel:+17134444723" className="hover:text-white">
            +1.713-444-4723
          </a>
          <p>Available 24/7</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/70 hover:text-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/70 hover:text-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z" />
              </svg>
            </a>
          </div>
          <p className="text-white/50">
            Copyright &copy; {new Date().getFullYear()} WellCommand Assurance
            &mdash; All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
