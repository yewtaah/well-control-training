export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  content: string;
};

export type Module = {
  slug: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  modules: Module[];
};

export const courses: Course[] = [
  {
    slug: "well-control-fundamentals",
    title: "Well Control Fundamentals",
    description:
      "Kick detection, shut-in procedures, and kill method calculations for rig crews.",
    modules: [
      {
        slug: "kick-detection",
        title: "Kick Detection",
        lessons: [
          {
            slug: "warning-signs",
            title: "Warning Signs of a Kick",
            summary: "Recognize the early indicators of an influx.",
            content:
              "A kick occurs when formation fluid enters the wellbore because formation pressure exceeds the hydrostatic pressure of the drilling fluid column. Primary indicators include an increase in pit volume that cannot be explained by surface additions, an increase in flow rate out of the well relative to the pump rate in, a decrease in pump pressure with a corresponding increase in pump speed, and the well continuing to flow with pumps shut down. Drilling break (a sudden increase in rate of penetration), gas-cut mud, and changes in torque or drag can also precede a kick, particularly when drilling into a transition zone or an unexpectedly overpressured formation. Crews should treat any single flow-check or pit-volume anomaly as a potential kick until it is ruled out — early detection is the single biggest factor in keeping a kick a routine well-control event rather than an emergency.",
          },
          {
            slug: "shut-in-procedures",
            title: "Shut-In Procedures",
            summary: "Steps to safely shut in the well after detecting a kick.",
            content:
              "Once a kick is confirmed, the well must be shut in immediately to prevent further influx. In a soft shut-in, the choke line valve is opened first, the annular or pipe ram preventer is closed, and then the choke is closed gradually — this method reduces surge pressure on the formation and is generally preferred on rigs equipped with an automated choke. In a hard shut-in, the preventer is closed first with the choke already closed, minimizing total mud loss and kick volume, but subjecting the wellbore and surface equipment to a sharper pressure spike. The choice between methods is typically pre-determined in the rig's well control plan based on formation strength and equipment capability. After shut-in, the driller records the stabilized shut-in drill pipe pressure (SIDPP), shut-in casing pressure (SICP), and pit gain — these three readings drive every subsequent kill calculation.",
          },
        ],
      },
      {
        slug: "kill-methods",
        title: "Kill Methods",
        lessons: [
          {
            slug: "drillers-method",
            title: "Driller's Method",
            summary: "Two-circulation kill method fundamentals.",
            content:
              "The Driller's Method circulates out the kick first, using the original mud weight, then circulates a second time with kill-weight mud to balance formation pressure. On the first circulation, drill pipe pressure is held constant at the initial circulating pressure (ICP) while the choke operator adjusts casing pressure to compensate for the influx moving up the annulus. Once the kick is fully circulated out, the second circulation begins: heavier kill mud is pumped down the drill string while drill pipe pressure is stepped down along a predetermined schedule until it matches the final circulating pressure (FCP), at which point kill mud has displaced the wellbore and the well is dead. The Driller's Method is slower than the Engineer's Method because it requires two full circulations, but it is operationally simpler and is often preferred when kill-weight mud is not immediately available at surface.",
          },
          {
            slug: "engineers-method",
            title: "Engineer's Method",
            summary: "One-circulation kill method fundamentals.",
            content:
              "The Engineer's Method, also called the Wait-and-Weight Method, circulates the kick and kill-weight mud simultaneously in a single circulation. Before pumping begins, the mud is weighted up to kill weight at surface. Drill pipe pressure is then reduced from the ICP down to the FCP following a schedule based on the volume of kill mud pumped, while casing pressure is monitored and adjusted at the choke to keep bottomhole pressure constant. Because it requires only one circulation, the Engineer's Method typically kills the well faster and imposes less total pressure and time exposure on the wellbore and surface equipment than the Driller's Method — but it requires the kill mud weight to be calculated and mixed accurately before circulation starts, and any calculation error is compounded across the full circulation.",
          },
        ],
      },
    ],
  },
  {
    slug: "wild-well-control",
    title: "Wild Well Control",
    description:
      "Blowout prevention, well kill methods, and emergency response for uncontrolled well events.",
    modules: [
      {
        slug: "blowout-prevention",
        title: "Blowout Prevention",
        lessons: [
          {
            slug: "bop-stack-components",
            title: "BOP Stack Components",
            summary: "Overview of blowout preventer stack equipment.",
            content:
              "A typical BOP stack is built from multiple layers of redundant well-control equipment stacked on top of the wellhead. Annular preventers use a rubber packing element that can close around any size or shape of pipe in the hole, or seal off entirely on open hole, making them the first line of defense during a kick. Below the annular, ram preventers use opposing steel rams to seal the wellbore — pipe rams close around a specific pipe diameter, blind rams seal open hole when no pipe is present, and shear rams cut through the drill string entirely before sealing, used as a last resort. The choke manifold routes flow from the BOP stack to the choke, where pressure is controlled during a well-control event, and the kill line provides an alternate path to pump kill-weight mud directly into the annulus if the normal circulating path is unavailable. Stack configuration (the number and order of these components) is specified by the well's pressure rating and regulatory requirements before drilling begins.",
          },
        ],
      },
      {
        slug: "emergency-response",
        title: "Emergency Response",
        lessons: [
          {
            slug: "incident-command",
            title: "Incident Command on a Wild Well",
            summary: "Roles and coordination during a blowout response.",
            content:
              "Once a well control event escalates beyond the rig crew's ability to regain control at surface, response shifts to an Incident Command System (ICS) structure to coordinate specialized well-control contractors, the operator, regulators, and emergency services. The Incident Commander holds overall authority for the response and is typically supported by dedicated leads for operations (well-kill engineering and equipment), planning (source control strategy, relief well design if required), logistics (equipment mobilization, personnel, site access), and safety (site hazards, evacuation zones, H2S and fire risk). Clear, single-point command is critical because a wild well site involves many organizations working simultaneously under time pressure; ICS gives every participant a defined role and a single reporting chain, preventing the kind of miscommunication that can turn a difficult well-control problem into a safety incident on top of it.",
          },
        ],
      },
    ],
  },
  {
    slug: "field-readiness",
    title: "Field Readiness",
    description:
      "H2S awareness, rig floor safety, and emergency response drills for field personnel.",
    modules: [
      {
        slug: "h2s-awareness",
        title: "H2S Awareness",
        lessons: [
          {
            slug: "h2s-hazards",
            title: "Recognizing H2S Hazards",
            summary: "Properties and dangers of hydrogen sulfide gas.",
            content:
              "Hydrogen sulfide (H2S) is a colorless, flammable, and highly toxic gas commonly encountered in sour oil and gas formations. It is heavier than air and tends to collect in low-lying areas, cellars, and confined spaces. At low concentrations it has a distinctive rotten-egg odor, but at higher, more dangerous concentrations it rapidly deadens the sense of smell — meaning workers can no longer detect it by odor at exactly the concentrations where detection matters most. Personal H2S monitors and fixed area detectors are the only reliable way to know actual gas levels. Exposure symptoms escalate quickly from eye and respiratory irritation at low concentrations, to headache and dizziness, to loss of consciousness and death within minutes at high concentrations. Every worker on a site with H2S potential must be trained on monitor use, appropriate escape respirator donning, wind direction and muster point awareness, and the site's specific H2S contingency plan before entering the location.",
          },
        ],
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): { course: Course; courseModule: Module; lesson: Lesson } | undefined {
  const course = getCourse(courseSlug);
  const courseModule = course?.modules.find((m) => m.slug === moduleSlug);
  const lesson = courseModule?.lessons.find((l) => l.slug === lessonSlug);
  if (!course || !courseModule || !lesson) return undefined;
  return { course, courseModule, lesson };
}

export function allLessonsInOrder(
  course: Course
): { courseModule: Module; lesson: Lesson }[] {
  return course.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({ courseModule, lesson }))
  );
}
