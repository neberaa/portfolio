"use client";

import { Mail, Menu, X } from "lucide-react";
import { useState, type ReactElement } from "react";
import { layoutClass, measure, palette, typeClass } from "@/data/design";
import { screens } from "@/data/sections";
import { site } from "@/data/site";
import { getActiveNavId, getNavSections } from "@/helpers/sections";
import { useSiteScroll } from "@/hooks/use-site-scroll";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";
import type { Screen, ScreenId } from "@/types/section";

const navItems = getNavSections(screens);

type NavButtonProps = {
  item: Screen;
  current: boolean;
  onSelect: (id: ScreenId) => void;
  menu?: boolean;
};

const NavButton = ({ item, current, onSelect, menu = false }: NavButtonProps): ReactElement => {
  const select = (): void => {
    onSelect(item.id);
  };

  if (menu) {
    return (
      <button type="button" onClick={select} className={typeClass.menu}>
        {item.label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={select}
      aria-current={current ? "page" : undefined}
      className={`nav-link ${typeClass.nav}`}
    >
      {item.label}
      <span className={layoutClass.underline} />
    </button>
  );
};

export const Header = (): ReactElement => {
  const { activeId, scrollTo } = useSiteScroll();
  const activeNavId = getActiveNavId(activeId);
  const [open, setOpen] = useState(false);

  const go = (id: ScreenId): void => {
    setOpen(false);
    scrollTo(id);
  };

  const goHome = (): void => {
    go("home");
  };

  const toggleMenu = (): void => {
    setOpen(!open);
  };

  const renderNavItem = (item: Screen): ReactElement => (
    <NavButton key={item.id} item={item} current={item.id === activeNavId} onSelect={go} />
  );

  const renderMenuItem = (item: Screen): ReactElement => (
    <NavButton key={item.id} item={item} current={item.id === activeNavId} onSelect={go} menu />
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-30 ${layoutClass.page}`}>
      <div className="relative z-40 flex items-center justify-between">
        <div className={layoutClass.brandRow}>
          <button type="button" onClick={goHome} className={typeClass.brand}>
            AN
          </button>
          <span className={layoutClass.divider} aria-hidden />
          <a href={site.emailHref} aria-label="Email" className="text-cyan">
            <Mail color={palette.cyan} size={measure.iconSm} strokeWidth={measure.iconStroke} />
          </a>
          <a href={site.linkedIn} aria-label="LinkedIn" target="_blank" rel="noreferrer" className="text-cyan">
            <LinkedInIcon />
          </a>
        </div>

        <nav className={`${layoutClass.navRow} hidden md:flex`} aria-label="Primary">
          {navItems.map(renderNavItem)}
        </nav>

        <button
          type="button"
          className={`${layoutClass.menuButton} md:hidden`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {open ? (
            <X color={palette.ink} size={measure.iconMd} strokeWidth={measure.iconStroke} />
          ) : (
            <Menu color={palette.ink} size={measure.iconMd} strokeWidth={measure.iconStroke} />
          )}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Primary" className={`${layoutClass.menuPanel} md:hidden`}>
          {navItems.map(renderMenuItem)}
        </nav>
      ) : null}
    </header>
  );
};
