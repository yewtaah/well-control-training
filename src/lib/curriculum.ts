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

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type Quiz = {
  passPercent: number;
  questions: QuizQuestion[];
};

export type CourseStatus = "draft" | "published";

export type Course = {
  slug: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: CourseStatus;
  objectives: string[];
  /** Slugs of courses that should be completed first. */
  prerequisites: string[];
  modules: Module[];
  quiz: Quiz;
};

export const program = {
  title: "Well Command WC Training",
  audience: "Designed for all critical safety roles — office and field.",
  summary:
    "The Well Command well control training course covers pressure fundamentals, kick detection, shut-in procedures, kill methods, equipment operation, risk management, barrier integrity, and hands-on simulator practice. These topics ensure personnel can prevent, detect, and respond to well control events safely and effectively.",
  objective:
    "The objective of the training is to equip individuals to comprehend the basics of well control theory to facilitate and improve safety at the well. A well control incident detected early and properly responded to will be kept small, mitigating the complexities involved in large kicks.",
};

const DRAFT_NOTE =
  "This lesson is an outline placeholder. Final content is authored by well command  Assurance.";

export const courses: Course[] = [
  {
    slug: "course-introduction",
    order: 1,
    title: "Course Introduction",
    description:
      "Why well control training matters, the principles and industry requirements behind it, and how responsibility and barriers are structured.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "Explain the purpose and objectives of well control training",
      "Describe the well control principles and industry requirements that govern operations",
      "Apply ALARP thinking to well control decisions",
      "Identify the roles and responsibilities held during a well control event",
      "Distinguish primary, secondary, and tertiary well control barriers",
    ],
    prerequisites: [],
    modules: [
      {
        slug: "purpose-and-principles",
        title: "Purpose and Principles",
        lessons: [
          {
            slug: "why-well-control-training",
            title: "Purpose and Objectives of Well Control Training",
            summary: "What the training is for and who it is for.",
            content:
              "Well control training exists so that every person connected to a well — office and field alike — can recognise when the well is trying to tell them something and knows what to do about it. The measure of a well control programme is not how well a large kick is fought, but how rarely a kick is allowed to become large. " +
              DRAFT_NOTE,
          },
          {
            slug: "principles-and-industry-requirements",
            title: "Well Control Principles and Industry Requirements",
            summary: "The regulatory and industry framework around well control.",
            content:
              "Well control practice sits inside a framework of regulator requirements, operator standards, and industry guidance that set out competency, equipment testing, and procedural expectations. This lesson introduces that framework and where to find the requirements that apply to a given operation. " +
              DRAFT_NOTE,
          },
          {
            slug: "alarp-principles",
            title: "ALARP Principles",
            summary: "Reducing risk as low as reasonably practicable.",
            content:
              "ALARP — as low as reasonably practicable — is the principle that risk must be reduced until the cost of further reduction is grossly disproportionate to the benefit gained. It is introduced here as a way of thinking about well control decisions, and applied in detail in the Barrier Management course. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "roles-and-barriers",
        title: "Roles and Barriers",
        lessons: [
          {
            slug: "roles-and-responsibilities",
            title: "Roles and Responsibilities During Well Control Operations",
            summary: "Who does what when the well starts flowing.",
            content:
              "Every position on and off the rig floor has a defined role during a well control event, from the driller who shuts the well in to the office roles who support the kill decision. Clarity about those roles before an event is what allows the response to be fast and unambiguous during one. " +
              DRAFT_NOTE,
          },
          {
            slug: "barrier-overview",
            title: "Overview of Well Control Barriers",
            summary: "Primary, secondary, and tertiary barriers.",
            content:
              "The primary barrier is the hydrostatic column of drilling fluid holding back formation pressure. The secondary barrier is the mechanical equipment — BOP stack, wellhead, casing — that contains the well when the primary barrier fails. The tertiary barrier covers the interventions available once both have been lost, such as dynamic kills and relief wells. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "What is the primary well control barrier?",
          options: [
            "The BOP stack",
            "The hydrostatic pressure of the drilling fluid column",
            "The choke manifold",
            "A relief well",
          ],
          answerIndex: 1,
          explanation:
            "The drilling fluid column is the primary barrier. Mechanical equipment such as the BOP stack is the secondary barrier, used when the primary barrier fails.",
        },
        {
          id: "q2",
          prompt: "ALARP requires that risk be reduced until:",
          options: [
            "It reaches zero",
            "The regulator signs off on the operation",
            "Further reduction costs are grossly disproportionate to the benefit",
            "The operation is completed",
          ],
          answerIndex: 2,
          explanation:
            "ALARP — as low as reasonably practicable — is a proportionality test, not a demand for zero risk.",
        },
        {
          id: "q3",
          prompt:
            "The stated objective of this training is best described as:",
          options: [
            "Certifying personnel to operate a BOP stack unsupervised",
            "Equipping individuals to comprehend well control theory so incidents are detected early and kept small",
            "Replacing the need for a rig-specific well control plan",
            "Training office staff only",
          ],
          answerIndex: 1,
          explanation:
            "Early detection and a correct response keep a kick small; that is the core objective of the programme.",
        },
      ],
    },
  },
  {
    slug: "pressure-fundamentals",
    order: 2,
    title: "Pressure Fundamentals",
    description:
      "The pressure relationships that govern every well control decision, from hydrostatic head to MAASP.",
    estimatedMinutes: 40,
    status: "draft",
    objectives: [
      "Calculate hydrostatic pressure from mud weight and true vertical depth",
      "Distinguish formation pressure, bottomhole pressure, and fracture pressure",
      "Explain equivalent circulating density and its operational effect",
      "Determine MAASP and describe why it constrains a kill",
      "Describe how pressure changes during drilling, tripping, and circulation",
    ],
    prerequisites: ["course-introduction"],
    modules: [
      {
        slug: "pressure-basics",
        title: "Pressure Basics",
        lessons: [
          {
            slug: "hydrostatic-pressure",
            title: "Hydrostatic Pressure",
            summary: "The pressure exerted by the fluid column.",
            content:
              "Hydrostatic pressure is the pressure exerted at any depth by the weight of the fluid column above it, and depends on fluid density and true vertical depth — not on hole size or measured depth. It is the primary barrier, and every well control calculation starts from it. " +
              DRAFT_NOTE,
          },
          {
            slug: "formation-pressure",
            title: "Formation Pressure",
            summary: "Pore pressure and how it is predicted and detected.",
            content:
              "Formation pressure is the pressure of the fluid held in the pore space of the rock. Normal, abnormal, and subnormal pressure regimes, and the indicators used to predict and detect them while drilling, are covered here. " +
              DRAFT_NOTE,
          },
          {
            slug: "bottomhole-pressure",
            title: "Bottomhole Pressure Concepts",
            summary: "How BHP is built up and what changes it.",
            content:
              "Bottomhole pressure is the sum of the hydrostatic head plus any applied surface pressure plus annular friction losses when circulating. Understanding which of those terms is under the crew's control at any moment is the basis of constant-bottomhole-pressure well control. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "dynamic-pressure",
        title: "Pressure in Operation",
        lessons: [
          {
            slug: "equivalent-circulating-density",
            title: "Equivalent Circulating Density",
            summary: "The effective mud weight while circulating.",
            content:
              "ECD expresses the combined effect of static mud weight and annular friction pressure as an equivalent density. It explains why a well can be stable while circulating and take a kick when the pumps stop, and why it can be lost to the formation on start-up. " +
              DRAFT_NOTE,
          },
          {
            slug: "fracture-pressure-and-maasp",
            title: "Fracture Pressure and MAASP",
            summary: "The upper limit on wellbore pressure.",
            content:
              "Fracture pressure is the pressure at which the exposed formation breaks down and takes fluid. MAASP — the maximum allowable annular surface pressure — converts that downhole limit into a surface pressure the choke operator can actually read and respect during a kill. " +
              DRAFT_NOTE,
          },
          {
            slug: "pressure-during-operations",
            title: "Pressure Relationships During Drilling, Tripping, and Circulation",
            summary: "How the pressure balance shifts with the operation.",
            content:
              "Each operation shifts the pressure balance in a characteristic way: circulation adds friction pressure, tripping out swabs pressure off bottom, tripping in surges pressure onto the formation, and connections remove ECD entirely. Recognising which way the balance is moving is what allows a crew to anticipate a kick rather than react to one. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Hydrostatic pressure depends on mud density and:",
          options: [
            "Measured depth",
            "True vertical depth",
            "Hole diameter",
            "Circulating rate",
          ],
          answerIndex: 1,
          explanation:
            "Only the vertical height of the fluid column contributes to hydrostatic pressure; measured depth and hole size do not.",
        },
        {
          id: "q2",
          prompt: "Equivalent circulating density is higher than static mud weight because:",
          options: [
            "Cuttings are removed from the annulus",
            "Annular friction pressure adds to the hydrostatic head while circulating",
            "The mud is heated downhole",
            "Surface pressure is applied at the choke",
          ],
          answerIndex: 1,
          explanation:
            "ECD is static mud weight plus the annular friction pressure expressed as an equivalent density.",
        },
        {
          id: "q3",
          prompt: "MAASP is best described as:",
          options: [
            "The maximum pump pressure the rig can deliver",
            "The maximum surface annulus pressure before the weakest exposed formation breaks down",
            "The shut-in drill pipe pressure after stabilisation",
            "The rated working pressure of the annular preventer",
          ],
          answerIndex: 1,
          explanation:
            "MAASP translates the formation strength limit at the casing shoe into a surface pressure limit the choke operator can work to.",
        },
      ],
    },
  },
  {
    slug: "drilling-fluids",
    order: 3,
    title: "Drilling Fluids & Mud System Behavior",
    description:
      "How the mud system is controlled and monitored, and how its behaviour signals what the well is doing.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "Describe mud weight and density control in practice",
      "Explain how rheology and gel strengths affect well control",
      "Recognise gas-cut mud and other contamination and judge its significance",
      "Use pit volume and trip tank monitoring as well control instruments",
      "Identify mud system limitations that constrain the operation",
    ],
    prerequisites: ["pressure-fundamentals"],
    modules: [
      {
        slug: "mud-properties",
        title: "Mud Properties",
        lessons: [
          {
            slug: "mud-weight-and-density-control",
            title: "Mud Weight and Density Control",
            summary: "Maintaining the primary barrier at the planned weight.",
            content:
              "Mud weight is the primary barrier expressed as a number, and holding it within its planned window is a continuous task shared between the mud engineer and the rig crew. This lesson covers weighting up, cutting back, and the checks that confirm what is actually in the hole. " +
              DRAFT_NOTE,
          },
          {
            slug: "rheology-and-gel-strengths",
            title: "Rheology and Gel Strengths",
            summary: "Flow behaviour and its well control consequences.",
            content:
              "Rheology governs annular friction and therefore ECD, while gel strengths govern the pressure required to break circulation after the pumps have been off. Both have direct well control consequences on start-up and during a kill. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "system-behavior",
        title: "System Behaviour and Monitoring",
        lessons: [
          {
            slug: "gas-cut-mud-and-contamination",
            title: "Gas-Cut Mud and Contamination",
            summary: "What gas cutting does and does not tell you.",
            content:
              "Gas-cut mud reduces the density of the returns and can look alarming at surface while representing only a small loss of bottomhole pressure. Water, cement, and formation solids contamination each change mud properties in ways that must be recognised and corrected. " +
              DRAFT_NOTE,
          },
          {
            slug: "pit-and-trip-tank-monitoring",
            title: "Pit Volume and Trip Tank Monitoring",
            summary: "The volume record that reveals an influx.",
            content:
              "Pit volume management and disciplined trip tank monitoring turn the mud system into the most sensitive kick indicator available. Every surface transfer must be accounted for so that an unexplained gain means exactly one thing. " +
              DRAFT_NOTE,
          },
          {
            slug: "mud-system-limitations",
            title: "Mud System Limitations and Operational Impacts",
            summary: "Where the system constrains the operation.",
            content:
              "Mixing capacity, barite stock, active volume, and solids control throughput all set limits on how quickly the mud weight can be raised — which in turn constrains which kill method is realistically available. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt:
            "Heavily gas-cut mud at surface usually indicates that bottomhole pressure has been reduced by:",
          options: [
            "A very large amount, proportional to the surface cutting",
            "A relatively small amount, because gas expands mostly near surface",
            "Nothing at all",
            "An amount equal to the pit gain",
          ],
          answerIndex: 1,
          explanation:
            "Gas expansion is concentrated near surface, so dramatic surface cutting corresponds to a comparatively small reduction in bottomhole pressure.",
        },
        {
          id: "q2",
          prompt: "Gel strength most directly affects well control by determining:",
          options: [
            "The pressure required to break circulation after the pumps are off",
            "The formation pressure",
            "The BOP closing time",
            "The shear ram cutting force",
          ],
          answerIndex: 0,
          explanation:
            "Gels must be broken before circulation restarts, and the pressure spike involved is imposed on the formation.",
        },
        {
          id: "q3",
          prompt: "Why must every surface mud transfer be recorded?",
          options: [
            "For mud cost accounting only",
            "So that an unexplained pit gain can be treated unambiguously as a possible influx",
            "To satisfy the mud engineer's report",
            "To calculate ECD",
          ],
          answerIndex: 1,
          explanation:
            "Pit volume is only a reliable kick indicator when every legitimate change in volume is already accounted for.",
        },
      ],
    },
  },
  {
    slug: "kick-causes-and-warning-signs",
    order: 4,
    title: "Kick Causes & Warning Signs",
    description:
      "Why kicks happen and the indicators that appear before and as an influx enters the wellbore.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "List the operational causes of a kick and how each defeats the primary barrier",
      "Explain how swabbing and poor hole fill-up practices induce influxes",
      "Recognise the surface warning signs of a kick",
      "Interpret gas levels and mud log indicators as early evidence",
    ],
    prerequisites: ["drilling-fluids"],
    modules: [
      {
        slug: "kick-causes",
        title: "Kick Causes",
        lessons: [
          {
            slug: "why-kicks-happen",
            title: "Causes of a Kick",
            summary: "Inadequate mud weight, lost circulation, and underbalanced conditions.",
            content:
              "A kick occurs whenever formation pressure exceeds the pressure the wellbore is imposing on it. That imbalance arises from inadequate mud weight, from losing hydrostatic head to a thief zone, from drilling deliberately underbalanced, or from equipment and procedural failures that let the column fall. " +
              DRAFT_NOTE,
          },
          {
            slug: "tripping-and-hole-fill",
            title: "Swabbing and Hole Fill-Up Practices",
            summary: "How tripping induces an influx.",
            content:
              "Pulling pipe too quickly swabs pressure off bottom, and failing to keep the hole full replaces heavy mud with nothing at all. Both are procedural causes of kicks, and both are entirely within the crew's control. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "warning-signs",
        title: "Warning Signs",
        lessons: [
          {
            slug: "recognising-the-warning-signs",
            title: "Warning Signs of a Kick",
            summary: "Recognise the early indicators of an influx.",
            content:
              "A kick occurs when formation fluid enters the wellbore because formation pressure exceeds the hydrostatic pressure of the drilling fluid column. Primary indicators include an increase in pit volume that cannot be explained by surface additions, an increase in flow rate out of the well relative to the pump rate in, a decrease in pump pressure with a corresponding increase in pump speed, and the well continuing to flow with pumps shut down. Drilling break (a sudden increase in rate of penetration), gas-cut mud, and changes in torque or drag can also precede a kick, particularly when drilling into a transition zone or an unexpectedly overpressured formation. Crews should treat any single flow-check or pit-volume anomaly as a potential kick until it is ruled out — early detection is the single biggest factor in keeping a kick a routine well-control event rather than an emergency.",
          },
          {
            slug: "gas-levels-and-mud-log-indicators",
            title: "Gas Levels and Mud Log Indicators",
            summary: "Reading the mud log for pressure trends.",
            content:
              "Background gas, connection gas, trip gas, and shale density and cuttings trends give the earliest evidence that the pressure regime is changing. Reading them together, rather than individually, is what turns them into a usable warning. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Which of these is a kick cause rather than a warning sign?",
          options: [
            "Pit gain",
            "Increase in flow out",
            "Swabbing while tripping out",
            "Decrease in pump pressure",
          ],
          answerIndex: 2,
          explanation:
            "Swabbing reduces bottomhole pressure and causes the influx; the others are indications that an influx has already begun.",
        },
        {
          id: "q2",
          prompt:
            "A well that continues to flow with the pumps shut down should be treated as:",
          options: [
            "Normal after a connection",
            "A confirmed or probable kick requiring immediate action",
            "A hole cleaning issue",
            "Evidence of lost circulation",
          ],
          answerIndex: 1,
          explanation:
            "Flow with the pumps off is one of the most definitive kick indicators and demands immediate action.",
        },
        {
          id: "q3",
          prompt: "Failing to keep the hole full while tripping out causes a kick because:",
          options: [
            "The mud weight increases",
            "Hydrostatic head is lost as the fluid level in the annulus drops",
            "Annular friction increases",
            "The gel strength breaks down",
          ],
          answerIndex: 1,
          explanation:
            "Steel removed from the hole must be replaced with mud, or the fluid level and therefore the hydrostatic pressure falls.",
        },
      ],
    },
  },
  {
    slug: "kick-detection-and-verification",
    order: 5,
    title: "Kick Detection & Verification",
    description:
      "The instruments and procedures used to detect an influx and confirm it before acting.",
    estimatedMinutes: 30,
    status: "draft",
    objectives: [
      "Carry out and interpret a flow check",
      "Describe flow-out monitoring systems, pit volume totalizers, and advanced flow sensors",
      "Distinguish a genuine kick from a false indication",
      "State the immediate actions on detection of an influx",
    ],
    prerequisites: ["kick-causes-and-warning-signs"],
    modules: [
      {
        slug: "detection-methods",
        title: "Detection Methods",
        lessons: [
          {
            slug: "flow-checks",
            title: "Flow Checks",
            summary: "When to flow check and how to read the result.",
            content:
              "A flow check stops the pumps and observes whether the well continues to flow. When it is performed, how long it is held, and how the result is interpreted are all defined in the rig's well control procedures. " +
              DRAFT_NOTE,
          },
          {
            slug: "flow-monitoring-instrumentation",
            title: "Flow Monitoring and Instrumentation",
            summary: "Totalizers, flow-out systems, and Coriolis meters.",
            content:
              "Pit volume totalizers, flow-out paddle and ultrasonic systems, and Coriolis mass flow meters each detect an influx at a different threshold and speed. Knowing the sensitivity and failure mode of the equipment installed determines how much confidence to place in it. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "verification",
        title: "Verification and First Actions",
        lessons: [
          {
            slug: "confirming-a-kick",
            title: "Confirming a Kick vs. False Indications",
            summary: "Ruling out the benign explanations quickly.",
            content:
              "Ballooning, thermal expansion, surface transfers, and instrument faults can all mimic an influx. The verification step exists to rule those out — but it must be short, because the cost of a delayed shut-in exceeds the cost of an unnecessary one. " +
              DRAFT_NOTE,
          },
          {
            slug: "immediate-actions",
            title: "Immediate Actions Upon Detection",
            summary: "The sequence from indication to shut-in.",
            content:
              "On detection, the crew alerts, stops the operation, positions the string, and moves to shut in under the procedure applicable to that rig. Speed comes from having drilled the sequence, not from deciding it in the moment. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "The purpose of a flow check is to:",
          options: [
            "Measure the mud weight",
            "Observe whether the well flows with the pumps stopped",
            "Test the BOP",
            "Confirm the pump output",
          ],
          answerIndex: 1,
          explanation:
            "With the pumps off there is no circulation to explain returns, so continued flow indicates the well is feeding.",
        },
        {
          id: "q2",
          prompt: "Wellbore ballooning matters in kick detection because it:",
          options: [
            "Always indicates a kick",
            "Can mimic an influx by returning fluid the formation absorbed",
            "Prevents the BOP from closing",
            "Increases the mud weight",
          ],
          answerIndex: 1,
          explanation:
            "Ballooning returns previously lost fluid and can look like a flowing well, which is why verification exists.",
        },
        {
          id: "q3",
          prompt: "If verification is inconclusive, the correct action is to:",
          options: [
            "Continue drilling and monitor",
            "Shut the well in and evaluate under controlled conditions",
            "Increase the pump rate",
            "Open the choke",
          ],
          answerIndex: 1,
          explanation:
            "Shutting in on a false alarm is recoverable; continuing to drill on a real influx is not.",
        },
      ],
    },
  },
  {
    slug: "shut-in-procedures",
    order: 6,
    title: "Shut-In Procedures",
    description:
      "Surface and subsea shut-in methods, closure sequences, and the readings that drive the kill.",
    estimatedMinutes: 40,
    status: "draft",
    objectives: [
      "Compare hard and soft shut-in and state when each is used",
      "Describe spacing out and the BOP closure sequence",
      "Record and interpret SIDPP and SICP",
      "Explain the additional considerations that apply to a subsea BOP",
    ],
    prerequisites: ["kick-detection-and-verification"],
    modules: [
      {
        slug: "surface-bop",
        title: "Surface BOP",
        lessons: [
          {
            slug: "hard-and-soft-shut-in",
            title: "Hard and Soft Shut-In",
            summary: "Steps to safely shut in the well after detecting a kick.",
            content:
              "Once a kick is confirmed, the well must be shut in immediately to prevent further influx. In a soft shut-in, the choke line valve is opened first, the annular or pipe ram preventer is closed, and then the choke is closed gradually — this method reduces surge pressure on the formation and is generally preferred on rigs equipped with an automated choke. In a hard shut-in, the preventer is closed first with the choke already closed, minimizing total mud loss and kick volume, but subjecting the wellbore and surface equipment to a sharper pressure spike. The choice between methods is typically pre-determined in the rig's well control plan based on formation strength and equipment capability. After shut-in, the driller records the stabilized shut-in drill pipe pressure (SIDPP), shut-in casing pressure (SICP), and pit gain — these three readings drive every subsequent kill calculation.",
          },
          {
            slug: "spacing-out-and-closure-sequence",
            title: "Spacing Out and BOP Closure Sequence",
            summary: "Positioning the string before closing.",
            content:
              "Spacing out positions the string so that no tool joint sits across a ram and the required valves remain accessible. The closure sequence that follows is rig-specific and must be practised until it is automatic. " +
              DRAFT_NOTE,
          },
          {
            slug: "recording-sidpp-and-sicp",
            title: "Recording SIDPP and SICP",
            summary: "The three numbers that drive the kill.",
            content:
              "Stabilised shut-in drill pipe pressure, shut-in casing pressure, and pit gain are recorded as soon as pressures settle. Every kill calculation depends on them, so how long to wait and how to read through a float valve matter. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "subsea-bop",
        title: "Subsea BOP",
        lessons: [
          {
            slug: "deepwater-considerations",
            title: "Deepwater Considerations and Riser Margin",
            summary: "What changes when the stack is on the seabed.",
            content:
              "With the BOP on the seabed, choke line friction, seawater hydrostatic effects, and riser margin all change the pressures seen at surface and the response to shutting in. Wellhead and LMRP dynamics add further constraints. " +
              DRAFT_NOTE,
          },
          {
            slug: "emergency-disconnect-systems",
            title: "Emergency Disconnect Systems",
            summary: "Securing the well and separating from it.",
            content:
              "The EDS sequence secures the well and disconnects the riser when station keeping is lost or conditions require the rig to move off. Its trigger criteria and the state it leaves the well in are covered here. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Compared with a soft shut-in, a hard shut-in:",
          options: [
            "Allows a larger influx but lower peak pressure",
            "Minimises influx volume but imposes a sharper pressure spike",
            "Cannot be used with an annular preventer",
            "Is only used subsea",
          ],
          answerIndex: 1,
          explanation:
            "Closing with the choke already shut stops the influx sooner at the cost of a harder pressure transient.",
        },
        {
          id: "q2",
          prompt: "Which three readings are recorded immediately after shut-in?",
          options: [
            "ECD, MAASP, and mud weight",
            "SIDPP, SICP, and pit gain",
            "Pump rate, torque, and ROP",
            "Riser margin, choke pressure, and gel strength",
          ],
          answerIndex: 1,
          explanation:
            "These three values drive every subsequent kill sheet calculation.",
        },
        {
          id: "q3",
          prompt: "Spacing out before shutting in is done to:",
          options: [
            "Increase hydrostatic pressure",
            "Ensure no tool joint is across a ram and required valves stay accessible",
            "Reduce the pit gain",
            "Break the gels",
          ],
          answerIndex: 1,
          explanation:
            "Rams cannot seal on a tool joint, so string position must be controlled before closure.",
        },
      ],
    },
  },
  {
    slug: "post-shut-in-activities",
    order: 7,
    title: "Post Shut-In Activities",
    description:
      "Stabilising, sizing the influx, verifying limits, and selecting the kill method.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "Judge when shut-in pressures have stabilised",
      "Estimate influx size and infer influx type",
      "Verify MAASP against the recorded pressures",
      "Prepare a kill sheet",
      "Select an appropriate kill method for the conditions",
    ],
    prerequisites: ["shut-in-procedures", "pressure-fundamentals"],
    modules: [
      {
        slug: "stabilisation-and-assessment",
        title: "Stabilisation and Assessment",
        lessons: [
          {
            slug: "pressure-stabilisation",
            title: "Pressure Stabilisation",
            summary: "Knowing when the readings are trustworthy.",
            content:
              "Shut-in pressures rise and then settle as the influx and the wellbore reach equilibrium. Reading too early gives a false low; waiting too long allows gas migration to distort the picture. " +
              DRAFT_NOTE,
          },
          {
            slug: "influx-size-estimation",
            title: "Influx Size Estimation",
            summary: "Volume, height, and fluid type.",
            content:
              "Pit gain gives influx volume, which combined with annular capacity gives influx height, and the pressure differential between SIDPP and SICP indicates the density and therefore the likely type of the influx fluid. " +
              DRAFT_NOTE,
          },
          {
            slug: "maasp-verification",
            title: "MAASP Verification",
            summary: "Checking the pressure limit against reality.",
            content:
              "MAASP is recalculated from the current mud weight and shoe strength and compared against the recorded SICP, establishing how much margin the kill has before formation breakdown becomes a risk. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "planning-the-kill",
        title: "Planning the Kill",
        lessons: [
          {
            slug: "kill-sheet-preparation",
            title: "Kill Sheet Preparation",
            summary: "Turning readings into a pump schedule.",
            content:
              "The kill sheet converts the recorded pressures and well geometry into kill mud weight, initial and final circulating pressures, and a step-down pressure schedule. Pre-recorded data must be kept current for it to be usable under pressure. " +
              DRAFT_NOTE,
          },
          {
            slug: "method-selection",
            title: "Method Selection",
            summary: "Choosing between Driller's, Wait & Weight, Volumetric, and Concurrent.",
            content:
              "Method selection weighs the time needed to weight up, the pressure margin available at the shoe, whether circulation is possible at all, and crew capability. The methods themselves are covered in the next course. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "A much higher SICP than SIDPP generally indicates:",
          options: [
            "A water influx",
            "A low-density influx such as gas in the annulus",
            "A plugged bit",
            "A failed float valve",
          ],
          answerIndex: 1,
          explanation:
            "The annulus contains lighter influx fluid, so less hydrostatic head offsets formation pressure on that side.",
        },
        {
          id: "q2",
          prompt: "Influx height is estimated from pit gain together with:",
          options: [
            "The annular capacity opposite the influx",
            "The pump output",
            "The gel strength",
            "The riser margin",
          ],
          answerIndex: 0,
          explanation:
            "Volume divided by annular capacity gives the vertical height the influx occupies.",
        },
        {
          id: "q3",
          prompt: "The kill sheet's step-down schedule controls:",
          options: [
            "Casing pressure during the second circulation only",
            "Drill pipe pressure as kill mud fills the string, holding bottomhole pressure constant",
            "The rate the BOP closes",
            "Mud mixing capacity",
          ],
          answerIndex: 1,
          explanation:
            "As heavier mud displaces the string, drill pipe pressure is reduced on schedule to keep bottomhole pressure constant.",
        },
      ],
    },
  },
  {
    slug: "well-control-methods",
    order: 8,
    title: "Well Control Methods",
    description:
      "Circulating and non-circulating kill methods, their pump schedules, and their limitations.",
    estimatedMinutes: 40,
    status: "draft",
    objectives: [
      "Execute the Driller's Method and state its advantages and limitations",
      "Develop a Wait & Weight pump schedule and its pressure control requirements",
      "Apply the Volumetric Method to control gas migration in a non-circulating well",
      "Describe the Concurrent Method and its added pressure control complexity",
      "Judge when bullheading is appropriate and what risks it carries",
    ],
    prerequisites: ["post-shut-in-activities"],
    modules: [
      {
        slug: "circulating-methods",
        title: "Circulating Methods",
        lessons: [
          {
            slug: "drillers-method",
            title: "Driller's Method",
            summary: "Two-circulation kill method fundamentals.",
            content:
              "The Driller's Method circulates out the kick first, using the original mud weight, then circulates a second time with kill-weight mud to balance formation pressure. On the first circulation, drill pipe pressure is held constant at the initial circulating pressure (ICP) while the choke operator adjusts casing pressure to compensate for the influx moving up the annulus. Once the kick is fully circulated out, the second circulation begins: heavier kill mud is pumped down the drill string while drill pipe pressure is stepped down along a predetermined schedule until it matches the final circulating pressure (FCP), at which point kill mud has displaced the wellbore and the well is dead. The Driller's Method is slower than the Wait & Weight Method because it requires two full circulations, but it is operationally simpler and is often preferred when kill-weight mud is not immediately available at surface.",
          },
          {
            slug: "wait-and-weight-method",
            title: "Wait & Weight Method",
            summary: "One-circulation kill method fundamentals.",
            content:
              "The Wait & Weight Method, also called the Engineer's Method, circulates the kick and kill-weight mud simultaneously in a single circulation. Before pumping begins, the mud is weighted up to kill weight at surface. Drill pipe pressure is then reduced from the ICP down to the FCP following a schedule based on the volume of kill mud pumped, while casing pressure is monitored and adjusted at the choke to keep bottomhole pressure constant. Because it requires only one circulation, the Wait & Weight Method typically kills the well faster and imposes less total pressure and time exposure on the wellbore and surface equipment than the Driller's Method — but it requires the kill mud weight to be calculated and mixed accurately before circulation starts, and any calculation error is compounded across the full circulation.",
          },
        ],
      },
      {
        slug: "non-circulating-methods",
        title: "Non-Circulating and Alternative Methods",
        lessons: [
          {
            slug: "volumetric-method",
            title: "Volumetric Method",
            summary: "Controlling gas migration when circulation is not possible.",
            content:
              "When the well cannot be circulated, the Volumetric Method allows migrating gas to expand in a controlled way by bleeding measured volumes of mud while holding casing pressure within a chosen working band. Lubrication and stripping operations extend the same principle. " +
              DRAFT_NOTE,
          },
          {
            slug: "concurrent-method",
            title: "Concurrent Method",
            summary: "Raising mud weight while circulating out.",
            content:
              "The Concurrent Method starts circulating immediately and raises mud weight in stages as the kill mud becomes available. It begins sooner than Wait & Weight but demands continual recalculation of the pressure schedule, which is why it is operationally the most demanding of the circulating methods. " +
              DRAFT_NOTE,
          },
          {
            slug: "bullheading",
            title: "Bullheading",
            summary: "Pumping the influx back into the formation.",
            content:
              "Bullheading forces the wellbore contents back into the formation without circulating. It is chosen when circulating is unacceptable — H2S, a plugged string, no returns path — and is constrained by formation integrity and by the risk of fracturing at an unintended depth. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "During the first circulation of the Driller's Method, drill pipe pressure is:",
          options: [
            "Stepped down on a schedule",
            "Held constant at the initial circulating pressure",
            "Allowed to float",
            "Held at MAASP",
          ],
          answerIndex: 1,
          explanation:
            "The first circulation removes the influx at original mud weight, so ICP is held constant while the choke handles the annulus.",
        },
        {
          id: "q2",
          prompt: "The principal advantage of the Wait & Weight Method is that it:",
          options: [
            "Requires no kill sheet",
            "Kills the well in a single circulation, reducing pressure and time exposure",
            "Works without circulating the well",
            "Eliminates the need for a choke operator",
          ],
          answerIndex: 1,
          explanation:
            "One circulation means less total exposure — at the cost of needing accurate kill mud weight before starting.",
        },
        {
          id: "q3",
          prompt: "The Volumetric Method is used when:",
          options: [
            "Kill mud is already weighted up",
            "The well cannot be circulated and gas is migrating",
            "The influx is water",
            "Surface pressure is zero",
          ],
          answerIndex: 1,
          explanation:
            "It manages the pressure rise from migrating gas by bleeding measured mud volumes, without circulation.",
        },
      ],
    },
  },
  {
    slug: "choke-operations",
    order: 9,
    title: "Choke Operations & Pressure Control",
    description:
      "Operating the choke to hold bottomhole pressure constant, and reading what the gauges are telling you.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "Compare manual and remote choke operation",
      "Apply choke manipulation principles during a kill",
      "Maintain constant bottomhole pressure through pressure changes",
      "Read and interpret pressure trends at the choke panel",
      "Describe the purpose and conduct of choke drills",
    ],
    prerequisites: ["well-control-methods"],
    modules: [
      {
        slug: "choke-systems",
        title: "Choke Systems",
        lessons: [
          {
            slug: "manual-vs-remote-choke",
            title: "Manual vs. Remote Choke Operation",
            summary: "Equipment differences and their operational consequences.",
            content:
              "Remote hydraulic chokes are operated from a panel with pressure and stroke feedback; manual chokes are worked at the manifold with far less information available. Each demands a different rhythm of adjustment and a different communication discipline. " +
              DRAFT_NOTE,
          },
          {
            slug: "choke-manipulation-principles",
            title: "Choke Manipulation Principles",
            summary: "Small adjustments and lag time.",
            content:
              "The choke controls surface backpressure, but the effect of any adjustment is delayed by the time the pressure wave takes to travel the wellbore. Small, deliberate changes and patience through the lag are what keep the kill stable. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "pressure-control-practice",
        title: "Pressure Control in Practice",
        lessons: [
          {
            slug: "maintaining-constant-bhp",
            title: "Maintaining Constant Bottomhole Pressure",
            summary: "The governing objective of every kill.",
            content:
              "Every circulating kill method is a means to the same end: holding bottomhole pressure constant and slightly above formation pressure. Drill pipe pressure is the gauge that reports whether that is being achieved. " +
              DRAFT_NOTE,
          },
          {
            slug: "reading-pressure-trends",
            title: "Reading and Interpreting Pressure Trends",
            summary: "Diagnosing the well from the gauges.",
            content:
              "Rising casing pressure with gas approaching surface, an unexpected drop suggesting losses, and divergence from the kill sheet schedule each have a diagnosis and a response. This lesson works through the common trend signatures. " +
              DRAFT_NOTE,
          },
          {
            slug: "choke-drills-and-simulation",
            title: "Choke Drills and Simulator Practice",
            summary: "Building the response before it is needed.",
            content:
              "Choke drills and simulator time build the timing judgement that cannot be learned from a kill sheet. An interactive choke drill exercise is planned for this course. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Opening the choke during a kill will:",
          options: [
            "Increase bottomhole pressure",
            "Decrease surface backpressure and therefore bottomhole pressure",
            "Have no effect until the pumps stop",
            "Increase drill pipe pressure",
          ],
          answerIndex: 1,
          explanation:
            "The choke sets surface backpressure, which adds directly to bottomhole pressure.",
        },
        {
          id: "q2",
          prompt: "Choke adjustments should be small and deliberate because:",
          options: [
            "The choke wears quickly",
            "Pressure changes take time to propagate through the wellbore, so over-correction is easy",
            "The pumps cannot respond quickly",
            "MAASP changes continuously",
          ],
          answerIndex: 1,
          explanation:
            "Lag between adjustment and response is what causes over-correction and unstable kills.",
        },
        {
          id: "q3",
          prompt: "Which gauge is the primary indicator of bottomhole pressure during a kill?",
          options: [
            "Casing pressure",
            "Drill pipe pressure",
            "Standpipe flow rate",
            "Trip tank level",
          ],
          answerIndex: 1,
          explanation:
            "The drill string contains known fluid, so drill pipe pressure acts as the bottomhole pressure gauge.",
        },
      ],
    },
  },
  {
    slug: "well-control-equipment",
    order: 10,
    title: "Well Control Equipment",
    description:
      "BOP systems, the choke manifold, gas handling, and the supporting equipment that makes secondary control possible.",
    estimatedMinutes: 40,
    status: "draft",
    objectives: [
      "Identify the components of a BOP stack and the function of each",
      "Describe control systems, accumulators, and testing and certification requirements",
      "Trace flow paths through the choke manifold and explain its redundancy",
      "Explain the function and limitations of the mud-gas separator",
      "Describe float valves, IBOPs, diverters, and riser systems",
    ],
    prerequisites: ["shut-in-procedures"],
    modules: [
      {
        slug: "bop-systems",
        title: "BOP Systems",
        lessons: [
          {
            slug: "annular-and-ram-preventers",
            title: "BOP Stack Components",
            summary: "Overview of blowout preventer stack equipment.",
            content:
              "A typical BOP stack is built from multiple layers of redundant well-control equipment stacked on top of the wellhead. Annular preventers use a rubber packing element that can close around any size or shape of pipe in the hole, or seal off entirely on open hole, making them the first line of defense during a kick. Below the annular, ram preventers use opposing steel rams to seal the wellbore — pipe rams close around a specific pipe diameter, blind rams seal open hole when no pipe is present, and shear rams cut through the drill string entirely before sealing, used as a last resort. The choke manifold routes flow from the BOP stack to the choke, where pressure is controlled during a well-control event, and the kill line provides an alternate path to pump kill-weight mud directly into the annulus if the normal circulating path is unavailable. Stack configuration (the number and order of these components) is specified by the well's pressure rating and regulatory requirements before drilling begins.",
          },
          {
            slug: "control-systems-and-accumulators",
            title: "Control Systems and Accumulators",
            summary: "Stored energy and how the stack is operated.",
            content:
              "Accumulator bottles store the hydraulic energy needed to close the stack without the rig's pumps, and the control system routes that energy from the driller's panel, the remote panel, or the emergency station. Capacity requirements and function testing are covered here. " +
              DRAFT_NOTE,
          },
          {
            slug: "testing-and-certification",
            title: "Testing and Certification Requirements",
            summary: "Proving the secondary barrier works.",
            content:
              "Pressure tests, function tests, and certification intervals establish that the secondary barrier will hold when it is needed. Documentation of those tests is as much a part of the barrier as the equipment. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "surface-handling",
        title: "Surface Handling Equipment",
        lessons: [
          {
            slug: "choke-manifold",
            title: "Choke Manifold",
            summary: "Components, flow paths, and redundancy.",
            content:
              "The choke manifold provides the controlled path from the BOP stack to the gas handling equipment, with parallel choke runs so that a washed-out choke can be isolated and bypassed without losing control of the well. " +
              DRAFT_NOTE,
          },
          {
            slug: "mud-gas-separator",
            title: "Mud-Gas Separator",
            summary: "Function, vent line, and high-rate limitations.",
            content:
              "The mud-gas separator strips gas from returns and vents it safely, but has a finite gas handling rate. Exceeding it blows the liquid seal and sends gas to the shakers — a limitation that must be understood before the kill starts, not during it. " +
              DRAFT_NOTE,
          },
          {
            slug: "additional-equipment",
            title: "Float Valves, IBOPs, Diverters, and Risers",
            summary: "The supporting equipment set.",
            content:
              "Float valves and IBOPs control flow up the drill string, diverters route shallow gas away from the rig rather than containing it, and riser systems form the return path on floating operations. Each has a specific and limited role. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Which preventer can seal around any size or shape of pipe in the hole?",
          options: ["Blind rams", "Shear rams", "The annular preventer", "Pipe rams"],
          answerIndex: 2,
          explanation:
            "The annular's elastomer packing element conforms to whatever is in the hole, or closes on open hole.",
        },
        {
          id: "q2",
          prompt: "A diverter differs from a BOP in that it is designed to:",
          options: [
            "Contain full formation pressure",
            "Route flow safely away from the rig rather than shut the well in",
            "Cut the drill string",
            "Separate gas from mud",
          ],
          answerIndex: 1,
          explanation:
            "Diverters are used where the formation cannot withstand shut-in pressure, typically shallow gas.",
        },
        {
          id: "q3",
          prompt: "Exceeding the mud-gas separator's gas handling capacity results in:",
          options: [
            "Higher mud weight",
            "Loss of the liquid seal and gas carried through to the shakers",
            "Automatic BOP closure",
            "Reduced casing pressure",
          ],
          answerIndex: 1,
          explanation:
            "The separator relies on a liquid seal; blowing it puts gas into the mud processing area.",
        },
      ],
    },
  },
  {
    slug: "barrier-management",
    order: 11,
    title: "Barrier Management & Risk Mitigation",
    description:
      "Barrier philosophy, verification, human factors, and formal risk assessment applied to well control.",
    estimatedMinutes: 35,
    status: "draft",
    objectives: [
      "Explain primary and secondary barrier philosophy in operational terms",
      "Describe how barriers are verified and monitored",
      "Identify human factors that degrade barriers over time",
      "Participate in HAZID and HAZOP assessments",
      "Apply ALARP to well control risk decisions",
    ],
    prerequisites: ["course-introduction", "well-control-equipment"],
    modules: [
      {
        slug: "barrier-philosophy",
        title: "Barrier Philosophy",
        lessons: [
          {
            slug: "primary-and-secondary-barriers",
            title: "Primary and Secondary Barrier Philosophy",
            summary: "Two independent barriers, at all times.",
            content:
              "The governing principle is that two independent, tested barriers stand between formation fluids and the environment at all times. Operations are planned around maintaining that condition, and any activity that reduces it to one barrier requires explicit control. " +
              DRAFT_NOTE,
          },
          {
            slug: "barrier-verification",
            title: "Barrier Verification",
            summary: "Proving the barrier is still there.",
            content:
              "A barrier that has not been verified is an assumption. Verification defines what test proves each barrier, how often it is repeated, and who accepts the result. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "risk-mitigation",
        title: "Risk Mitigation",
        lessons: [
          {
            slug: "human-factors",
            title: "Human Factors in Barrier Degradation",
            summary: "How barriers are lost gradually.",
            content:
              "Barriers rarely fail suddenly. Normalisation of deviance, alarm fatigue, handover gaps, and time pressure erode them over shifts and weeks, which is why the human element belongs in barrier management rather than beside it. " +
              DRAFT_NOTE,
          },
          {
            slug: "hazid-and-hazop",
            title: "Operational Risk Assessment: HAZID and HAZOP",
            summary: "Structured hazard identification.",
            content:
              "HAZID identifies the hazards present in an operation; HAZOP works systematically through deviations from design intent. Both feed the well control plan by establishing what could defeat a barrier and what safeguard answers it. " +
              DRAFT_NOTE,
          },
          {
            slug: "alarp-in-practice",
            title: "ALARP in Practice",
            summary: "Applying the principle to real decisions.",
            content:
              "Applying ALARP to well control means demonstrating that the safeguards in place are proportionate to the risk, and documenting the reasoning when a further safeguard is judged grossly disproportionate. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "Two-barrier philosophy requires that the barriers be:",
          options: [
            "Identical in type",
            "Independent and individually verified",
            "Both mechanical",
            "Installed only during a kick",
          ],
          answerIndex: 1,
          explanation:
            "Independence is what prevents a single failure mode from defeating both barriers at once.",
        },
        {
          id: "q2",
          prompt: "Normalisation of deviance describes:",
          options: [
            "A statistical method for pressure data",
            "Deviations from procedure becoming accepted practice because nothing has gone wrong yet",
            "Recalibrating a pressure gauge",
            "Adjusting mud weight to plan",
          ],
          answerIndex: 1,
          explanation:
            "Repeated uneventful deviations gradually redefine what the crew treats as normal, quietly eroding barriers.",
        },
        {
          id: "q3",
          prompt: "The difference between HAZID and HAZOP is that HAZOP:",
          options: [
            "Only applies offshore",
            "Works systematically through deviations from design intent",
            "Replaces the well control plan",
            "Is performed only after an incident",
          ],
          answerIndex: 1,
          explanation:
            "HAZID identifies hazards broadly; HAZOP examines deviations from intended operating conditions node by node.",
        },
      ],
    },
  },
  {
    slug: "non-conventional-methods",
    order: 12,
    title: "Non-Conventional WC Methods",
    description:
      "Pills, plugs, dynamic kills, and relief wells — the interventions used when conventional methods will not work.",
    estimatedMinutes: 30,
    status: "draft",
    objectives: [
      "Judge when non-conventional methods are appropriate",
      "Describe the design and placement of barite pills",
      "Compare reactive pills including DOBC, PHPA, and sodium silicate",
      "Explain the principle of a dynamic kill",
      "Describe the role and timeline of a relief well",
    ],
    prerequisites: ["well-control-methods"],
    modules: [
      {
        slug: "pills-and-plugs",
        title: "Pills and Plugs",
        lessons: [
          {
            slug: "application-and-decision-criteria",
            title: "Application and Decision Criteria",
            summary: "When conventional methods are not available.",
            content:
              "Non-conventional methods are reached for when conventional circulating control is impossible or has failed — no circulation path, an unresponsive well, or an event that has already escalated. The decision criteria and who owns the decision are covered here. " +
              DRAFT_NOTE,
          },
          {
            slug: "barite-pills",
            title: "Barite Pills",
            summary: "Settling a high-density plug across the influx.",
            content:
              "A barite pill is a slug of very high density slurry designed to settle and form a plug that restores hydrostatic control. Design, placement, and the risk of premature settling are covered here. " +
              DRAFT_NOTE,
          },
          {
            slug: "reactive-pills",
            title: "Reactive Pills",
            summary: "DOBC, PHPA, and sodium silicate systems.",
            content:
              "Reactive pills form a plug through a chemical or physical reaction downhole — diesel oil bentonite cement, crosslinked PHPA systems, and sodium silicate among them. Each has a distinct placement window and set of risks. " +
              DRAFT_NOTE,
          },
        ],
      },
      {
        slug: "major-interventions",
        title: "Major Interventions",
        lessons: [
          {
            slug: "dynamic-kills",
            title: "Dynamic Kills",
            summary: "Killing with friction and rate rather than density alone.",
            content:
              "A dynamic kill uses high pump rates so that friction pressure plus hydrostatic head exceeds formation pressure, holding the well until heavier fluid can be established. It depends on having pumping capacity and an injection path. " +
              DRAFT_NOTE,
          },
          {
            slug: "relief-wells",
            title: "Relief Wells",
            summary: "The intervention of last resort.",
            content:
              "A relief well intercepts the blowing wellbore at depth to pump kill fluid directly into it. Planning typically begins early in a major event because drilling and ranging take weeks — it is the option that must be started before it is known to be needed. " +
              DRAFT_NOTE,
          },
        ],
      },
    ],
    quiz: {
      passPercent: 80,
      questions: [
        {
          id: "q1",
          prompt: "A dynamic kill works by:",
          options: [
            "Allowing gas to migrate freely",
            "Using high pump rates so friction plus hydrostatic pressure exceeds formation pressure",
            "Shearing the drill string",
            "Bleeding mud volumetrically",
          ],
          answerIndex: 1,
          explanation:
            "Rate-dependent friction pressure supplements hydrostatic head until heavier fluid can be established.",
        },
        {
          id: "q2",
          prompt: "Relief well planning is normally started early in a major event because:",
          options: [
            "Regulations require it before shut-in",
            "Drilling and ranging take weeks, so waiting for certainty costs time that cannot be recovered",
            "It is cheaper than any other option",
            "It replaces the need for surface intervention",
          ],
          answerIndex: 1,
          explanation:
            "The long lead time means the decision has to be made before the outcome of surface intervention is known.",
        },
        {
          id: "q3",
          prompt: "The purpose of a barite pill is to:",
          options: [
            "Reduce ECD",
            "Settle out and form a high-density plug that restores hydrostatic control",
            "Increase annular friction",
            "Lubricate the string during stripping",
          ],
          answerIndex: 1,
          explanation:
            "The pill settles across the influx zone, forming a plug that restores control from below.",
        },
      ],
    },
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

export function lessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function lessonKey(moduleSlug: string, lessonSlug: string): string {
  return `${moduleSlug}/${lessonSlug}`;
}

export function programMinutes(): number {
  return courses.reduce((n, course) => n + course.estimatedMinutes, 0);
}
