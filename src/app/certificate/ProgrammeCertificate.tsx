"use client";

import { Certificate } from "@/components/Certificate";
import { useProgressContext } from "@/components/ProgressProvider";
import { courseCompletion, programmeCompletion } from "@/lib/certificate";
import { courses, program } from "@/lib/curriculum";

export function ProgrammeCertificate() {
  const { data } = useProgressContext();
  const completion = programmeCompletion(data);

  const outstanding = courses
    .filter((course) => !courseCompletion(data, course.slug).complete)
    .map((course) => `Finish ${course.order}. ${course.title}.`);

  return (
    <Certificate
      scope="programme"
      title={program.title}
      subtitle={`All ${completion.coursesTotal} courses · full programme`}
      statement="has completed every course in the programme and passed each knowledge check, meeting the Well Command  Assurance standard for"
      earned={completion.complete}
      completedAt={completion.completedAt}
      outstanding={outstanding}
      backHref="/courses"
      backLabel="Curriculum"
    />
  );
}
