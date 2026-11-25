import type { ReactElement } from "react";
import { ExploreRail } from "@/components/layout/explore-rail";
import { Fullpage } from "@/components/layout/site-scroll";
import { Header } from "@/components/layout/header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Leadership } from "@/components/sections/leadership";
import { ProjectScreen } from "@/components/sections/project-screen";
import { Skills } from "@/components/sections/skills";
import { flagshipProject, pipelinerProject } from "@/data/projects";

const HomePage = (): ReactElement => (
  <>
    <Header />
    <ExploreRail />
    <main>
      <Fullpage>
        <Hero />
        <About />
        <Skills />
        <ProjectScreen project={flagshipProject} />
        <ProjectScreen project={pipelinerProject} />
        <Leadership />
        <Contact />
      </Fullpage>
    </main>
  </>
);

export default HomePage;
