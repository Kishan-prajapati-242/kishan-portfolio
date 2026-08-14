// CONTENT.md section 9, "Education, the single source".
//
// Two institutions, newest first. School-level education is deliberately
// absent: it adds nothing for someone hiring a co-op and it pushes the work
// further down the page.
//
// The undergraduate figure carries both scales on purpose. 8.32 out of 10 is
// what P P Savani awarded; 3.6 out of 4.0 is the conversion a US reader needs
// to place it. Showing the conversion alone would be presenting a number no
// institution actually issued, which is the sort of thing the rest of this
// site exists to argue against.

export interface Education {
  institution: string;
  school?: string;
  place: string;
  degree: string;
  field: string;
  from: string;
  to: string;
  /** Short label for the timeline rail. */
  span: string;
  grade: { value: string; scale: string; note?: string };
  /** Two or three sentences. Plain, first person, no adjectives doing the work. */
  body: string;
  courses: { code?: string; name: string }[];
  coursesLabel: string;
  /** Monogram for the node badge. Two characters, no more. */
  mark: string;
  current?: boolean;
}

export const EDUCATION: Education[] = [
  {
    institution: 'Northeastern University',
    school: 'Khoury College of Computer Sciences',
    place: 'Boston, Massachusetts',
    degree: 'Master of Science',
    field: 'Computer Science',
    from: 'January 2026',
    to: 'May 2028, expected',
    span: '2026 to 2028',
    grade: { value: '3.78', scale: 'out of 4.0', note: 'cumulative, August 2026' },
    body:
      'I took the theory and systems courses first rather than the applied ones, because the failure modes I care about live there. The natural language processing course is where the paper now under review at ACL Rolling Review started, as a term project that turned into a first-author submission. The GPA is carried alongside teaching three courses and building the retrieval system in the work section.',
    coursesLabel: 'Coursework so far',
    courses: [
      { code: 'CS 5800', name: 'Algorithms' },
      { code: 'CS 5010', name: 'Programming Design Paradigm' },
      { code: 'CS 6120', name: 'Natural Language Processing' },
    ],
    mark: 'NU',
    current: true,
  },
  {
    institution: 'P P Savani University',
    place: 'Surat, Gujarat, India',
    degree: 'Bachelor of Technology',
    field: 'Information Technology and Engineering',
    from: 'October 2021',
    to: 'May 2025',
    span: '2021 to 2025',
    grade: { value: '8.32', scale: 'out of 10', note: '3.6 out of 4.0 equivalent, First Class with Distinction' },
    body:
      'Four years, and the part that mattered was the sixteen months as a research assistant under Dr. Jayashri Patil alongside the coursework. Three of my four papers came out of that lab. I am the first person in my family to go to university.',
    coursesLabel: 'Highest grades in',
    courses: [
      { name: 'Design and Analysis of Algorithms' },
      { name: 'Data Structures' },
      { name: 'Discrete Mathematics' },
      { name: 'Artificial Intelligence' },
      { name: 'Machine Learning' },
      { name: 'Natural Language Processing' },
    ],
    mark: 'PP',
  },
];
