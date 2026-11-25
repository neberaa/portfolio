export const site = {
  name: "Anton Nebera",
  title: "Anton Nebera — Frontend Tech Lead & Engineer",
  description:
    "Frontend Tech Lead with 9+ years of experience building modern web applications, leading engineering teams and delivering scalable frontend architecture.",
  email: "neberaanton@gmail.com",
  emailHref: "mailto:neberaanton@gmail.com",
  linkedIn: "https://www.linkedin.com/in/anton-nebera-9a8232185/",
  linkedInLabel: "LinkedIn",
  cv: "/neberaanton.pdf",
  cvLabel: "CV",
  location: "Derbyshire, United Kingdom",
  role: "Frontend Tech Lead",
} as const;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: site.emailHref,
  url: site.linkedIn,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Derbyshire",
    addressCountry: "United Kingdom",
  },
  sameAs: [site.linkedIn],
  description: site.description,
} as const;
