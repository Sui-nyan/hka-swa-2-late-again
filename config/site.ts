export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Too late again",
  description: "A website for when you want to know what routes to avoid when travelling with Deutsche Bahn.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Map",
      href: "/map",
    },
    {
      label: "Connection",
      href: "/connection",
    },
  ],
};
