# CONTENT.md

Single source of truth for every word and number on the site.

**Hard rule for whoever builds this:** if a fact, number, claim, date, or link is not in this file, it does not go on the site. Do not infer, round, average, or "improve" a number. Do not write a sentence that implies a measurement this file does not contain. If something reads awkwardly, rewrite the sentence, not the fact.

**Plain English first, D-067.** Every item leads with a plain sentence saying
what the thing is and why it was hard, then the technical detail. Any term a
non-technical recruiter would not know either gets a half-clause of explanation
on first use or moves into the case study. That list is at least: HNSW,
pgvector, ef_search, p50, p99, SARI, Spearman correlation, QLoRA, embeddings,
entity F1, RRF. None of them may appear in a card summary, a capability card, or
above the fold on any page. All are welcome inside case studies. This is about
ordering, not vocabulary: nothing is dumbed down and no number is dropped.

**Style rules that apply to every string you emit:**
- No em dashes. Anywhere. Not in prose, not in alt text, not in meta descriptions. Use a comma, a colon, parentheses, or a full stop.
- Sentence case for headings. Not Title Case.
- No marketing verbs: leveraged, spearheaded, passionate, cutting-edge, robust, seamless, revolutionary, delve.
- First person singular, past or present tense, plain. "I measured" not "measurements were conducted".
- Numbers keep their units and their precision exactly as written here. 2.3 ms stays 2.3 ms, never "about 2 ms".
- Every performance number on the site must sit next to the conditions it was measured under. This is not a stylistic preference, it is the whole point of the site.

---

## 0. NEVER PUBLISH

These exist in source material. They must not appear in any file, comment, commit message, alt text, meta tag, or JSON-LD.

- Home address (any street address)
- Date of birth
- Northeastern student ID
- Phone number
- Names of students he tutors or grades
- Any grade, score, or result from his Northeastern coursework, including individual assignments, exams, oral exams, and per-course grades. Permitted: the two cumulative GPAs, First Class with Distinction, and the undergraduate subject-level distinction line in section 9.
- Any lease, housing, banking, or immigration document detail beyond the single work-authorization line in section 9
- Any patient text, MIMIC record, or PhysioNet data
- The name of any individual who declined to work with him
- Anything about his diet, health, or personal routines

---

## 1. IDENTITY

- Name, everywhere, exactly: **Kishan Prajapati**
- Pronouns: he/him
- Role line: MS Computer Science student, Khoury College of Computer Sciences, Northeastern University
- Location: Boston, Massachusetts
- Email: prajapati.kish@northeastern.edu
- GitHub: https://github.com/Kishan-prajapati-242
- LinkedIn: https://www.linkedin.com/in/kishan-prajapati-617a00202
- Google Scholar: https://scholar.google.com/citations?user=AqL9YRcAAAAJ
- LeetCode: https://leetcode.com/u/KishanSP242
- Hugging Face Space: https://huggingface.co/spaces/kishansp242/MoodLens

Do not use "Kish Prajapati". Do not use "Lead AI Researcher". Do not use "AI enthusiast".

**Approved positioning line, D-056.** The home page h1 is `SOFTWARE ENGINEER`, set as two lines with "Engineer" ghosted. This is approved as a positioning line rather than a claimed job title, and the lede directly beneath it carries the accurate framing: MS Computer Science at Northeastern. It is the only place this phrasing is used.

---

## 2. HOME PAGE

### H1
```
Kishan Prajapati
```

### Lede (directly under H1, max 2 sentences)
```
MS Computer Science at Northeastern. I build retrieval and NLP systems, and I spend a lot of my time checking whether my own measurements are capable of failing.
```

### Hero plot data (see DESIGN.md for how to render it)

Recall at 200 candidates, against exact top-200 computed by forced sequential scan.

| ef_search | recall@200 | stdev |
|---|---|---|
| 200 | 0.9431 | 0.0028 |
| 400 | 0.9766 | 0.0015 |
| 600 | 0.9857 | 0.0011 |
| 800 | 0.9898 | 0.0008 |

Operating point in production: ef_search 600, candidate depth N=200. Mark it.

Plot caption, verbatim, printed under the plot:
```
Ground truth is exact top-50 and top-200 for 520 queries, computed by forced sequential scan and committed to the repo. 500 of those 520 queries are corpus titles, which likely inflates recall relative to real topical queries. The cost of ef=600 over ef=200 was below measurement resolution on this hardware.
```

### Three measurement blocks

**Block 1**
- label: `end-to-end retrieval speedup`
- value: `6.3`
- unit: `x`
- state: measured
- provenance: `62.6 ms (query embed plus sequential scan) against 9.9 ms (query embed plus HNSW), both p50, same timing window on both sides. The retrieval-only ratio is 24x, but that excludes the encoder, which is 77 percent of end-to-end p50 and is the floor no index tuning can move.`
- links to `/work/sieve`

**Block 2**
- label: `Spearman correlation, entity retention gap against SARI`
- value: `-0.84`
- unit: none
- state: measured
- range: none
- provenance: `28 model-by-dataset cells. p < 10^-7. Block-permutation p < 10^-4 over 10,000 shuffles. Single seed (42) throughout because of compute limits, so no seed variance is reported.`
- links to `/papers`

**Block 3, and this one is the point of the page**
- label: `deduplication precision`
- value: null
- state: unmeasured
- reason: `Not measured. 14,135 papers merged, 13,567 decisions recorded, 12,909 rollback snapshots verified byte-identical on round trip. Precision needs hand-labeling of 120 stratified pairs. I have not done it, so I do not have the number.`
- links to `/notes`

### Secondary facts row (plain data, not measurement blocks)

```
200+   students graded across two courses
3      TA appointments, three faculty
4      papers, three published and one first-author under review
$0     infrastructure cost for a 182,853 paper search system
```

### Capability cards, home page, verbatim, D-067

```
Search and retrieval
Making search find what you meant, not just what you typed. I built one over 182,853 research papers that answers in about 10 milliseconds.

NLP research
Training language models, and more often checking whether the scores they earn actually mean anything. One first-author paper under review.

Backend engineering
Python, FastAPI and PostgreSQL. I like the unglamorous part: finding the one missing database index that was making a query 1,875 times slower.

Teaching
Three semesters as a teaching assistant at Northeastern, across algorithms, data science and discrete maths. Over 200 students.
```

The index figure is 1,875x, per the performance table in section 8. Kishan's
draft read "1,800 times slower"; the precise figure is used instead because this
document requires numbers to keep their precision.

### Project summaries, verbatim, D-067

```
Sieve
A search engine for research papers, built because I once screened over 200 by hand and never wanted to do it again. It holds 182,853 papers, finds them by meaning as well as by keyword, answers in about 10 milliseconds, and cost nothing to run.

Gatekeepn't
AI can rewrite medical documents to be easier for patients to read. We asked whether the standard way of scoring that work measures readability at all, or just measures copying the training data. First-author paper, under review.

ATCTM
A model that re-reads what someone said earlier once it learns what happened to them later, because the same sentence means something different before and after a bad week.

MoodLens
Type in a sentence and get six things back at once: the emotion, the event behind it, whether it is sarcastic, and more.

MoodInsight
Detecting signs of depression from how people write and speak. 88.10 percent accuracy, published at ICICC 2024.
```

"About 10 milliseconds" is the plain-English rendering of the 9.9 ms end-to-end
median in section 3, which still carries its exact figure and conditions there.

### Closing line on home page
```
Full engineering notes, including the six measurements I threw out because they were structurally incapable of failing, are on the notes page.
```

---

## 3. SIEVE (`/work/sieve`)

**Title:** Sieve
**Subtitle:** Literature search and triage over 182,853 papers, on a fanless laptop, for nothing
**Timeline:** July 2026, roughly 8 working days of active development
**Team:** solo
**Repo:** private during build. Link only if he has flipped it public. Otherwise render the repo row as "private, available on request".

### Why it exists
```
I hand-screened over 200 papers for the literature review that became our CML 2025 chapter. Sieve is the tool I wanted while doing that. The first real query I ran against the finished retrieval layer, "clinical text simplification", returned the same paper three times in the top 20. That became the recorded baseline for the deduplication work. It now returns no redundant copies.
```

### Stack
Python 3.12, FastAPI, Uvicorn, Pydantic v2, psycopg 3, raw SQL on every search path with no ORM. PostgreSQL 16 with pgvector, HNSW and halfvec, pg_trgm, tsvector plus GIN full text, JSONB, generated columns, forward-only migrations, connection pooling. Embeddings from bge-small-en-v1.5, 33M parameters, 384 dimensions, ONNX Runtime, CPU only, 512 token window. React 18, Vite, TypeScript, Tailwind, TanStack Query. Docker Compose for the whole stack with no host dependencies, Podman on macOS. pytest, ruff, mypy, GitHub Actions CI.

Hardware: M1 MacBook Air, 8 GB RAM, fanless, no GPU.

### Corpus table
| metric | value |
|---|---|
| papers live after dedup | 182,853 |
| papers ingested before dedup | 196,988 (196,893 OpenAlex, 95 arXiv) |
| raw source records retained | 199,382 |
| distinct DOIs | 181,635 |
| papers with no DOI | 15,258 (7.7 percent) |
| retracted papers flagged and kept | 173 |
| junk record types excluded at ingest | 1,499 across 6 OpenAlex types |
| specialty domain share | 62.2 percent against a 25 percent target floor |
| published 2017 or later | 90.3 percent, with a deliberate pre-2017 classics tail |
| database size | 2.25 GB |
| HNSW index size | 211 MB |
| tests passing | 118 (106 backend, 12 frontend) |
| design decision records | 9 |
| commits | 40+ |

**MANDATORY CAVEAT, must appear immediately after this table:**
```
Every latency and recall figure below was measured on the 196,893 paper pre-deduplication corpus. The live corpus is 182,853 after dedup. Re-measurement against the smaller corpus is pending, so the numbers here describe a slightly larger index than the one running now.
```

### Latency table
All measured through a custom benchmark harness with stated timing windows, discarded warmup, and a percentile guard.

| mode | SQL p50 | SQL p95 | end-to-end p50 | end-to-end p95 |
|---|---|---|---|---|
| bm25 keyword | 1.9 ms | 24.8 ms | no embed step | no embed step |
| vector, HNSW | 2.3 ms | 3.5 ms | 9.9 ms | 16.2 ms |
| hybrid, RRF | 6.3 ms | 26.7 ms | 13.7 ms | 31.0 ms |

Component decomposition of the vector path, p50:
- query embedding: 7.6 ms
- HNSW SQL at k=10: 2.3 ms
- end-to-end: 9.9 ms

Exact sequential scan baseline, which is the denominator for every speedup claim:
- warm cache p50: 55 to 58.8 ms. warm p95: 71 to 83 ms
- cold cache median: 1,126 ms, range 1,039 to 1,456. A 20x cold to warm gap, measured separately and never blended
- 600 samples: 120 distinct queries, 5 interleaved repetitions, 3 warmup scans discarded
- cold cache forced by restarting Postgres and dropping the VM page cache, orchestrated from the host

### The p99 measurement block (unmeasured variant)
- label: `p99 latency`
- state: unmeasured
- reason: `Not point-estimable on this hardware. Across runs it ranged 83.8 to 406.9 ms, a 4.9x spread. The harness gives a median across runs only when max divided by min is within 1.3, and otherwise returns null with the observed range. This is that case.`

### Cost engineering
OpenAlex moved to a metered API in February 2026. Free tier is $1 per day with a key and $0.01 per day without. `list` operations bill 1 credit, `search` operations bill 10.

| metric | value |
|---|---|
| works per credit, topic filters | 193 |
| works per credit, phrase search | 8 |
| efficiency gap | 24x |
| actual cost of the 200K corpus | 1,435 credits, 14 percent of one day's free allowance |
| requests | 1,040 |
| estimated cost under the original query design | ~6,600 credits |
| cost reduction from the migration | 4.6x |
| wall clock for the full pull | 24 minutes |

Also found: OpenAlex deprecated `/concepts` in favour of `/topics`, so the original query design had been built on a frozen taxonomy.

### The tokenizer study
Run across the entire corpus with the real WordPiece tokenizer.

| input variant | median | p95 | over 256 tokens | over 512 tokens |
|---|---|---|---|---|
| title only | 16 | 30 | 0.0 percent | 0.0 percent |
| abstract only | 227 | 511 | 39.6 percent | 5.0 percent |
| title plus abstract | 243 | 533 | 45.3 percent | 5.6 percent |
| title twice plus abstract | 259 | 556 | 51.0 percent | 6.4 percent |

```
I then decoded the truncation tails on real examples. In every case the discarded text was the Results and Conclusions section, because structured abstracts put the payoff last. That disqualified all-MiniLM-L6-v2, which truncates at 256 tokens, in favour of bge-small-en-v1.5, natively trained at 512, roughly 10 points better on MTEB BEIR retrieval, and identical at 384 dimensions so the schema did not change.
```

### Embedding pipeline
- 182,853 papers embedded, 100 percent coverage
- stored as `halfvec(384)`, fp16, 768 bytes per row
- measured throughput 13.2 docs per second in-container, fp32, length-sorted
- projected wall clock 248 minutes. Actual over 10 hours, a 2.4x miss caused by thermal throttling on fanless hardware
- peak RSS during encode 2.05 GB
- boilerplate re-encode: 3,847 papers title-only in 41 seconds, 94 docs per second
- boilerplate blocklist: 932 abstract hashes

### Vector index
- HNSW m=16, ef_construction=64
- build time 36 seconds for 196,893 halfvec(384) rows, parallel, 2 workers
- `maintenance_work_mem` needed 1 GB. The 64 MB default would have silently taken the spill path
- `/dev/shm` needed 2 GB. Docker's 64 MB default killed the build instantly
- Recall plateaus in the 0.989 to 0.990 range by ef=640. The limit is the m and ef_construction build parameters, not search depth.

### Deduplication
| metric | value |
|---|---|
| papers merged away | 14,135 (7.2 percent of corpus) |
| merge decisions recorded | 13,567 |
| rollback snapshots | 12,909, one per merge that deleted a row, round trip verified byte-identical |
| groups flagged for human review rather than merged | 57 groups, 889 papers |
| precision and recall | not measured |

| strategy | papers removed |
|---|---|
| abstract_hash, gated on title similarity | 7,673 |
| title_exact plus same year | 3,945 |
| preprint_trgm, surname blocking, plus or minus 1 year | 1,523 |
| jmir_doi, mechanical DOI identity | 536 |
| title_trgm | 458 |

```
86 percent of merges came from exact and mechanical keys and 14 percent from fuzzy matching. That is the correct shape for a cascade where under-merging is the safer error.
```

### Data quality recoveries
| metric | before | after | recovery |
|---|---|---|---|
| venue null rate | 8,295 | 471 | 94 percent |
| ACL Anthology venue nulls | 3,154 | 24 | 99.2 percent |

Root cause: extraction read only `primary_location.source.display_name`, and ACL Anthology works have no linked Source entity at all. They carry the venue as free text in a field that was never fetched.

### The adjacent-rank spacing analysis
```
The raw number is uninterpretable on its own: twin papers' embeddings differ by a median cosine distance of 0.0027. So instead I measured the median cosine distance between adjacent ranks inside a top-10 result set. That is 0.00213, with the rank 10 to 11 boundary at 0.00071. A stale vector therefore sits at 1.3x the adjacent-rank gap at the median and 43x at p90. It is large enough to reorder results, and at p90 it can push a paper out of the top 10 entirely. That reversed my starting assumption, which was that stale vectors were cosmetic.
```

### bm25 characterisation
- per-query SQL latency against bm25 match count: Pearson r = 0.663, Spearman 0.293
- the Spearman is low because the median query matches exactly one document, so the correlation is entirely tail-driven, which is what a p95 floor looks like
- widest query: 81,489 matching documents, 935.4 ms
- narrowest: 0 matches, 12.8 ms
- cause: the bm25 CTE ranks every match before applying LIMIT, so cost tracks match count rather than result count

**AND-semantics cliff.** `to_tsquery` requires every term to appear in the same document, so bm25 returns zero rows for long natural-language queries. Measured example: "reducing the reading difficulty of health leaflets for people with low literacy" returns nothing. Two consequences: keyword mode has a failure class on exactly the phrasing users actually type, and hybrid silently degenerates to vector-only on those queries because RRF receives only one input.

### Where each mode wins
- bm25 wins on `i2b2 2010 relation extraction challenge`. The exact identifier anchors it, while vector drifts to generic relation-extraction methods.
- vector wins on `reducing the reading difficulty of health leaflets for people with low literacy`. bm25 returns zero rows on AND semantics. Vector's top 4 are all on topic.
- hybrid beats both on `making medical documents easier to understand for patients`. Its top 3 is the union of bm25's unique find and vector's pair.
- On `clinical text simplification`, mutual agreement beat either ranker's individual confidence. A paper bm25 buried at rank 33 reached hybrid number 3 on the strength of vector rank 4.

PENDING KISHAN: recheck bench output for the clinical text simplification per-mode ranks.

### Not built (render this as a real section, not a footnote)
Dedup precision figure. PubMed client, though arXiv exists. Postgres SKIP LOCKED job queue, so ingestion is still synchronous. Collections and screening workflow. BibTeX export. Query caching. Keyset pagination. k6 load test and RPS ceiling. nDCG relevance evaluation. Prometheus metrics endpoint, though structured logging exists. Public deployment. Visual design pass.

Deployment constraint: the database is 2.25 GB and free managed Postgres tiers cap at 0.5 GB. The plan on record is a 40 to 50K subset deployed publicly with the full corpus local.

One outstanding commitment, recorded in his own notes and worth stating: one full understanding pass over the codebase, deferred by choice.

### Design decisions to surface on this page (9 exist in the Sieve repository's own docs/decisions.md, which is a different file from this repo's docs/DECISIONS.md)
Pick these five and quote the reasoning in one sentence each:
1. Python and FastAPI over Node and Express. The embedding model is Python-native, so Node forces two services, a network hop, two deploy targets, and two dependency sets.
2. Year-stratified corpus sampling over citation sort. Citation count is largely a proxy for age, so sorting by it excludes the recent work the eval queries target and makes BM25 look better than it is.
3. Retracted papers kept and flagged, not excluded. A systematic reviewer needs to see a retracted paper in order to exclude it deliberately, and to check what cites it.
4. Null the embedding at the write site rather than track a content hash. A hash column creates a second invariant that every text-mutating path has to maintain, and forgetting it yields a stale vector the system believes is fresh.
5. Reciprocal Rank Fusion over score addition. BM25 returns an unbounded score whose scale depends on corpus and query length, and cosine similarity has a different bounded distribution. RRF discards scores and keeps ranks, so it needs no per-query calibration.

---

## 4. GATEKEEPN'T (`/work/gatekeepnt`)

### PUBLISHING GATE. READ THIS BEFORE BUILDING THE PAGE.

This paper is under review at ACL Rolling Review. ARR removed the blanket anonymity period in February 2024, so posting non-anonymous work during review is not itself prohibited. But the ARR submission form has a preprint-status field, and if the binding "no non-anonymous preprint" option was selected, the authors committed to not preprinting until metareviews release, and violating that is grounds for desk rejection. ACL also warns that publicising unpublished work widely can disqualify knowledgeable reviewers.

Therefore: **build VARIANT A only.** Variant B has been removed from this document and from the repository while the paper is under ARR review. Do not reconstruct it from any other source.

### VARIANT A, ships now

Title on the site:
```
First-author paper under review, ACL Rolling Review, 2026
```

Body, verbatim:
```
Co-first author with Ning-Hsuan Tseng, with Asteria Kaeberlein and Malihe Alikhani, at Khoury College of Computer Sciences. The work started as my CS 6120 Natural Language Processing course project in Spring 2026 and ran from January to July 2026.

The question is whether a model that scores well on a medical text-simplification benchmark has actually learned to simplify. Four widely used corpora get treated as interchangeable training data and scored with the same metric. We audited what their reference edits actually do, then trained across three model architectures to see what a model learns from each one.

The headline result is a Spearman correlation of -0.84 across 28 model-by-dataset cells, p < 10^-7, with a block-permutation p < 10^-4 over 10,000 shuffles. The effect also shows up in zero-shot models that never saw these references, which locates the cause in the metric rather than in fine-tuning.

Full results, the corpus audit, and the training configuration are held back while the paper is under review. I will publish the case study when the review cycle closes.
```

Caveat block on Variant A:
```
Single seed (42) throughout because of compute limits, so no seed variance is reported. The study is retrospective: the audit and the model runs were produced in the same work.
```

Then a link out to the public repo, which already exists: https://github.com/Kishan-prajapati-242/Gatekeepnt

**Note on that repo:** the README lists a five-person team (Ning-Hsuan Tseng, Kishan Prajapati, Theresa Coleman, Shashank Kadiyala, Siddarth Chalasani) which is the course-project team, and the paper's author list is a different four people. Do not put both lists on the site. On the site, list only the paper's four authors and describe the repo as "course project repository". Kishan should reconcile the repo README separately.

### VARIANT B, removed

Variant B has been deleted from this document and from the repository while
the paper is under review at ACL Rolling Review. It is not held in a draft
file and it is not recoverable from this repository. It goes back only when
the review cycle closes.

## 5. OTHER PROJECTS (`/work`)

### ATCTM
**Adaptive Temporal-Contextual Transformer Model.** Independent research, December 2024 to present.
Repo: https://github.com/Kishan-prajapati-242/ATCTM

```
Seven-module BERT-based multi-task model. Two named components: a Subjective Impact Estimator, and a three-tier Temporal Event Memory that reinterprets earlier statements once a life event has occurred. It classifies six things from one input: event type, emotion, sentiment, sarcasm, tense, and certainty. The dataset is custom, over 490 life event types with Gen-Z context and over 49,000 annotated rows, labelled for sentiment, emotion, certainty, sarcasm, and temporal features. I built a separate synthetic dataset generator for it that emits strict JSON, 100 entries per event type, over a 17-emotion taxonomy.
```

**MANDATORY status line, exactly as written:**
```
ATCTM is proposed as a forward-looking direction inside the CML 2025 review chapter, where I am second author. It is not itself a separately published paper. The GitHub repository description currently says "Accepted at CML 2025", which conflates the two, and I am fixing it.
```

He should actually fix that repo description. It is in the launch checklist.

### MoodLens
Repo: https://github.com/Kishan-prajapati-242/MoodLens
Live: https://huggingface.co/spaces/kishansp242/MoodLens
MIT licensed.

```
A submodule of ATCTM and the only publicly running thing I have. Paste in a piece of text and it returns six attributes in real time: event type, emotion, sarcasm, sentiment, tense, and certainty. FastAPI, Python, DeBERTa-v3, plain HTML, CSS and JavaScript, deployed on Hugging Face Spaces.
```

This is the one live demo. Give it a prominent "open the live demo" link on both `/work` and the home page.

### MoodInsight
Repo: https://github.com/Kishan-prajapati-242/MoodInsight---depression-detection-on-Twitter-profile

```
Built during my research assistantship at P P Savani University under Dr. Jayashri Patil. A depression and personality detection system over text and speech. The React front end takes a Twitter user ID. Scope later expanded to social media monitoring across Twitter, Reddit and Facebook, plus integration concepts for voice assistants. The work led to the Springer LNNS chapter.
```

**Numbers. Read carefully.** Use only the published figure and label it:
```
The published ICICC chapter reports 88.10 percent accuracy with Multinomial Naive Bayes on TF-IDF plus sentiment polarity features over 20,000 labelled English tweets, an improvement of over 8 percent on prior work using the same dataset. My repo and LinkedIn have carried 89 percent for the combined text-and-speech system, which is a different measurement of a different system. The 88.10 percent figure is the one in the peer-reviewed paper, so that is the one I quote.
```

Do not put 89 percent on the site as a headline number. That sentence above is the only place the 89 may be mentioned, and only in that framing.

### Front-end repos, one compact row each, no case studies
- parallax: https://github.com/Kishan-prajapati-242/parallax  "Scroll-driven 3D and parallax effects, plain HTML and CSS."
- image-gallery: https://github.com/Kishan-prajapati-242/image-gallery  "Responsive image gallery, HTML and CSS."
- ProductCard: https://github.com/Kishan-prajapati-242/ProductCard  "Product card component, HTML and CSS."
- Modern-Chair: https://github.com/Kishan-prajapati-242/Modern-Chair  "CSS layout and illustration exercise."

Group these under a heading: `Earlier front-end practice`. One line each. Do not inflate them.

---

## 6. PAPERS (`/papers`)

Order newest first. Every entry gets: title, full author list with Kishan bolded, venue, date, DOI link, and his author position stated plainly.

**1.** First-author paper under review, ACL Rolling Review, 2026. See section 4, Variant A. No DOI, no public link to the manuscript.

**2.** A Review of Transforming AI for Depression Detection: Transformer Model Dominance, Multimodal Approaches, and Future Pathways
Jayashri Patil, **Kishan Prajapati**, Dhruvil Patel, Ravirajsinh Chauhan, Megha Patel
Computing and Machine Learning, CML 2025. Lecture Notes in Networks and Systems, volume 1612, pages 87 to 106. Springer Nature Singapore, published January 2026.
DOI: https://doi.org/10.1007/978-981-95-2872-1_7
Second author of five. Scopus indexed. Not indexed in Web of Science. 79 references.
Summary: `Transformer models dominate depression detection, with BERT at 93.8 percent mean accuracy across the reviewed studies, and social media data accounts for over 55 percent of the research. The chapter proposes ATCTM, using event-triggered updates and personalised dynamic embeddings, and discusses interpretability, data bias, and ethics.`

**3.** Enhanced Depression Detection on Social Media Using Advanced Machine Learning and Linguistic Analysis Techniques
Jayashri Patil, Vishal Patil, **Kishan Prajapati**, Dhruvil Patel, S. Trivedi, R. Patel
Intelligent Computing and Communication, ICICC 2024. Lecture Notes in Networks and Systems, volume 1240, pages 263 to 275. Springer Nature Singapore, published 1 August 2025. Presented August 2024 at CMR Institute of Technology, Hyderabad.
DOI: https://doi.org/10.1007/978-981-96-1264-2_23
Third author of six.
Summary: `20,000 labelled English tweets. TF-IDF features plus sentiment polarity plus LIWC dictionary features and hybrid combinations, across Multinomial Naive Bayes, logistic regression, and SVM. Best result 88.10 percent accuracy with MNB on TF-IDF plus sentiment polarity, over 8 percent above prior work on the same dataset. A secondary experiment on a random 4,000-tweet subset using LIWC features as binary labels gave the highest F1 and accuracy in the study.`

**4.** Towards a Sustainable Future: Enabling Industry with Green Web 3.0, Decentralized AI, and Edge Intelligence
Meenakshi Kashyap, Ravirajsinh Chauhan, Dhruvil Patel, **Kishan Prajapati**
ITM Web of Conferences, volume 65, article 03015, ICMAETM 2024. EDP Sciences. Open access under CC BY 4.0.
DOI: https://doi.org/10.1051/itmconf/20246503015
Full text PDF: https://www.itm-conferences.org/articles/itmconf/pdf/2024/08/itmconf_icmaetm2024_03015.pdf
Fourth author of four. His first conference presentation, at Sankalchand Patel University.
Note: this is the only one of the three with a freely downloadable full text, so link the PDF directly.

### Author position note, include it
```
Fourth of four in 2024, third of six in 2024, second of five in 2025, first of four in 2026.
```

### Citation counts
Do **not** put citation counts on the site. They go stale, they differ between Google Scholar and other indexes (Scholar shows 7 total across all papers, while one aggregator lists the CML chapter at 1 against Scholar's 2), and a low true number invites a bad read. Link Google Scholar instead and let the visitor look.

### Collaborators to name
Dr. Jayashri Patil, mentor at P P Savani University. Dhruvil Patel, peer co-author. On the ACL submission: Ning-Hsuan Tseng, Asteria Kaeberlein, Malihe Alikhani.

---

## 7. TEACHING (`/teaching`)

Intro, verbatim:
```
Graduate Teaching Assistant at Khoury College since May 2026. Three consecutive appointments, three courses, three different faculty, which mostly means each team asked me back.
```

| course | term | faculty |
|---|---|---|
| CS 3000 Algorithms and Data | Summer A 2026 | Laney Strange, Akshar Varma |
| DS 3000 Foundations of Data Science | Summer B 2026 | Xiaoyi Yang |
| CS 1800 Discrete Structures | Fall 2026, incoming | Laney Strange, Akshar Varma |

```
Over 200 students so far, and over 300 once CS 1800 starts. Day to day it is office hours, a weekly small-group session, grading homework and quizzes on Gradescope, writing recitation material, and answering Piazza and Teams threads.
```

### Working with the grading team
```
Grading at this scale only works if every grader makes the same call on the same mistake. Most of my time on a new assignment goes into agreeing the rubric with the other TAs before anyone starts marking, so a student's score does not depend on which of us opened their submission. When we disagree we settle it on real submissions rather than in the abstract.
```

### How I try to grade
```
Generous by default, consistent above all. Reward the idea, go light on arithmetic slips. If one early mistake breaks everything downstream it should cost a student once, not five times. I write comments the way I would want one from a classmate rather than a correction from above, and I leave them blank when there is nothing to fix.
```

### Office hours
```
Khoury uses a framework called GRASPING for graduated hints, which is a structured way of not simply handing over the answer. Most of the job is working out where someone's understanding actually stops, which is usually two steps earlier than they think.
```

### Helping people scope
```
A lot of the useful work happens before anyone writes code. I have sat with teams whose project proposals were not finishable in the time they had and helped them cut the idea down to something they could actually ship and be proud of. That conversation is worth more than any comment I could leave on a final submission.
```

Do not name any student.

### Earlier teaching
Competitive Programming Head, Google Developer Student Club, P P Savani University. August 2022 to September 2023.
```
I ran the club's competitive programming track: over 15 contests and hackathons with more than 1,000 participants across campuses, and weekly sessions for around 50 students. The part I liked most was the hour after each contest, going through the submissions that failed and working out with people where the thinking went wrong. Organising it taught me more about coordinating people than it did about algorithms.
```

Use September 2023 as the end date. His resume says August, LinkedIn says September. Pick one and it is September, matching LinkedIn.

---

## 8. NOTES (`/notes`)

This page is the differentiator. Nav label stays "Notes". Title it:
```
Bugs that passed their own tests
```
Intro:
```
Most of my worst bugs were not crashes. They were things that looked like they worked: a test that passed because it was asking the wrong question, a benchmark reporting a number it could not possibly have measured. Here are the ones worth writing down. The habit of asking whether a result could have failed is the most useful thing I have picked up so far.
```

**Structure, D-067.** Six stories plus one table, in this order, each leading
with a plain-English hook before the technical detail: the encoder that logged
2,304 rows against an empty database; resumability proven with a real SIGKILL;
the 20-sample worst-case figure; the API billing bug; the boilerplate abstracts
and the five hand-readings; the optimisation measured and declined. The table
compresses the five performance bugs to one line each.

Removed from this page: the six-bad-measurements table, the harness-changes
paragraph, the arXiv redirect and the HTTP 429. The harness discipline is shown
by the third story rather than stated as a list. All of those facts remain
recorded in this document below.

### The six bad measurements, as a table with real columns
| what was wrong | impact |
|---|---|
| p99 computed from 20 samples, so p95 and p99 both returned the maximum. A max labelled as a percentile. | Real p99 was 136.7 ms against the published 98.7 ms. 38 percent of the tail was hidden. |
| A latency shift attributed to query text length, when embedding sat outside the timing window, making that mechanism physically impossible. | An interleaved probe showed the composition effect was 0.1 ms. The shift was environmental noise. |
| A speedup ratio that put a scan-only numerator over an end-to-end denominator. | It understated the real result. 5.5x reported against 6.3x actual. |
| Fusion quality measured as overlap against the deepest ranking tested, which reaches 1.0 by construction. | Claim withdrawn. |
| p99 published at the favorable end of an observed range extending to 406.9 ms. | Superseded. p99 is now reported as a range behind a stability gate. |
| Verifying propagation by checking for zero title and citation drift, which cannot distinguish "propagation works" from "propagation is a no-op". | Rewritten as a synthetic mutation test, which then caught a real bug. |

PENDING KISHAN: reconcile the two p99 low ends, 83.8 and 95.8, from bench output.

### What changed in the harness because of them
```
percentile() returns None plus an explicit reason instead of a fake number when n is too small, pinned by a test asserting that percentile(twenty_samples, 0.99) is None. method_record() requires a timing_window keyword that cannot be omitted. speedup() takes both window strings and raises on mismatch. across_runs() gives a point estimate only when max divided by min across at least three runs is within 1.3, and otherwise returns the observed range. Cold and warm cache are reported separately and never blended. Every result carries its iteration count, warmup, cache state, plan forcing, and hardware.
```

### The test that could not fail
```
An encoder logged "embedded 2304" and the database held zero rows. psycopg connections default to implicit-transaction mode, where an open transaction turns every `with conn.transaction():` into a savepoint. So every per-batch commit rode inside one giant transaction that died with the process.

The unit test I had written for exactly this scenario was green, because it verified durability through the writer's own connection, and a connection always sees its own uncommitted work.

Fix: autocommit=True at job entrypoints, and both backfill() and ingest() now raise on a default-mode connection. The new tests verify durability from a second connection with the dying writer closed uncommitted. I stash-swapped the fix back out to confirm the new tests actually fail against the broken code.

The ingest loop had the identical latent defect, so the "a crash loses at most one work" guarantee on the 200K pull had been false the entire time. Had I not caught it, the 10-hour encode would have committed nothing.
```

### Resumability, proven with a real SIGKILL
```
Killed the encoder mid-batch at "embedded 2304", exit 137. A fresh connection saw exactly 2,304 durable rows and the uncommitted batch was correctly lost. Resume wrote exactly 2,696 more with no double work. All 2,304 pre-kill vectors were byte-identical after resume, verified by md5 diff of every row, output empty. The design reason it works: `embedding IS NULL` is the work queue, so there is no checkpoint file that can drift from the database.
```

### Performance bugs, as a table
| bug | before | after |
|---|---|---|
| Missing foreign key index | 1,140 ms | 0.608 ms, 1,875x |
| Quadratic dedup: self-join on md5(abstract) with no index on the expression | 11 minutes without finishing one strategy | all four strategies in seconds |
| pg_trgm `%` reads the similarity_threshold GUC and ignores the value in the WHERE clause, so it emitted everything above 0.3 and filtered to 0.92 afterward | timeout at 25 minutes | seconds |
| Rollback snapshot query scanning 191K rows per merge group instead of a primary key lookup | 3.3 hours | minutes |
| Slice-budget check running after the page generator had already fetched and been billed for the next page | 5 works cost 64 credits | identical rerun cost 32, both reconciled exactly with the server |

The billing one was found by credit instrumentation added deliberately, not by any test.

### The build that would have died at minute zero
```
pgvector allocates its HNSW build graph as a single upfront POSIX shared-memory segment, sized from maintenance_work_mem. The Postgres container's /dev/shm was Docker's 64 MB default. A probe build failed instantly with "could not resize shared memory segment to 1070632416 bytes". Fix was shm_size: 2g. Separately, maintenance_work_mem sat at its 64 MB default against a roughly 500 MB build graph, which would have silently taken the spill path and turned a 36-second build into an unexplained multi-hour one.
```

### Five times hand-reading the data overturned a rule that looked sound
```
23 boilerplate abstracts turned out to be 59, and roughly two thirds of those were legitimate: real structured abstracts, genuine dataset descriptions, and one paper about simplifying administrative texts. An automatic rule would have destroyed real signal.

Titles differing by a single digit, "Additional file 5" against "Additional file 7", scored 0.97 trigram similarity, and they were 79 percent of the population in exactly the threshold band a strict cutoff trusts most.

A parent paper and its own supplementary file matched at 0.921, in a form the enumerator rule was structurally blind to. The regression fixture asserting this could never happen had been passing, for the wrong reason.

"Preprint (Japanese) (AI-Ready)" and a Zenodo error message both sailed past a minimum-length guard, because generic strings can be long.

A legitimate textbook description, correctly kept off the blocklist, turned out to be a catastrophic dedup key that merged 23 distinct chapters into one paper.
```

Structural conclusion, quote it:
```
Records that are parts of, or versions of, a common parent inherit the parent's abstract. That is a permanent property of scholarly metadata, not an enumerable list of bad strings, so blocklisting treats symptoms. The structural fix was one condition: same abstract plus same title is a duplicate, same abstract plus different titles is siblings under a shared parent.
```

### Semantically meaningless embeddings
```
801 papers whose entire abstract is the string "International audience", a repository deposit artifact. 442 reading "Monthly data release from WikiPathways.org". 129 sharing an ethics disclaimer. Those papers' vectors were the embedding of that boilerplate string, sitting in the HNSW index. Fix was a boilerplate_abstracts blocklist table, 932 hashes covering 3,847 papers, which embed title-only. I chose a table rather than a computed predicate because "shared across N papers" is derived from the current corpus, and a predicate would silently change a paper's embedding policy as new sources landed.
```

### Ghost records
```
Proceedings volumes were being stored as papers, carrying a character-identical abstract copied from a member paper, and ranking right beside that paper in search results. Trigram title matching could never catch it, since the titles share nothing. Fixed with an ingest-time type filter across 6 OpenAlex types, 1,499 records, keeping the raw records for the audit trail.
```

### The optimisation I measured and declined
```
int8 dynamic quantization measured 29 docs per second against 13 for fp32, a 2.2x speedup, with cosine similarity to the fp32 vectors at a mean of 0.9977. I did not ship it. Cosine parity between two vectors of the same document does not establish that ranking is preserved, because ranking depends on relative distances across the whole corpus and small perturbations reorder near-ties. The correct metric is Recall@10 of the int8 index against the fp32 index, and that needs the fp32 index to exist first. So it is deferred as a measured optimisation, not a rejected one.
```

### Two small ones worth keeping
```
Diagnosing an HTTP 429 revealed the retry logic was discarding the response body, which contained the explanation. The deeper cause was that no API key was being sent at all, running the client at $0.01 a day instead of $1.00.

arXiv 301-redirects HTTP to HTTPS, and httpx does not follow cross-scheme redirects by default. Found on the first live run.
```

---

## 9. ABOUT (`/about`)

```
I am a first-generation college student from Gujarat, India. I did my B.Tech in Information Technology and Engineering at P P Savani University in Surat, October 2021 to May 2025, finishing at 8.32 out of 10 with First Class with Distinction, and highest grades in Design and Analysis of Algorithms, Data Structures, Discrete Mathematics, Artificial Intelligence, Machine Learning, and Natural Language Processing.

I started my MS in Computer Science at Northeastern's Khoury College in January 2026, currently at 3.7 out of 4.0, expecting to finish in May 2028. Coursework so far: CS 5010 Programming Design Paradigm, CS 6120 Natural Language Processing, and CS 5800 Algorithms.

Before Northeastern I was a research assistant at P P Savani under Dr. Jayashri Patil from November 2023 to March 2025, and a MERN stack developer intern at Technonite in Surat from December 2024 to March 2025.

The thing I actually care about is whether a number can be trusted. Most of my worst bugs were not crashes. They were measurements that returned a plausible value under conditions where returning a wrong value was the only thing they could have done. That is why my benchmark harness refuses to answer rather than guess, and why the notes page exists.
```

### Technonite, factual detail
```
Full-stack work in MongoDB, Express, React and Node across e-commerce, logistics and healthcare clients. A reusable React component library adopted across three projects, cutting duplication and speeding delivery by roughly 25 percent. A real-time logistics dashboard on Socket.io and the Google Maps API that improved dispatch tracking by roughly 30 percent.
```
Both percentages are self-reported estimates from that internship. Label them as estimates.

### Certifications
AWS Fundamentals Specialization, Amazon Web Services, April 2024. Building Web Applications in PHP, University of Michigan, April 2024. Three GST courses from PwC India via Coursera, 2023.

### Interview prep, one line
Over 400 LeetCode problems solved, working NeetCode 150 as the spine.

### Work authorization line, exactly this and nowhere else on the site
```
F-1 student, CPT eligible. Earliest internship or co-op start is January 2027. Primary target is Summer 2027.
```

### Interests, keep it to two sentences maximum
```
Outside coursework: photography and cinematic colour grading, mechanical keyboard building, and a long-running interest in the philosophy of machine consciousness and technological singularity, mostly through books rather than code.
```

Do not mention diet, calorie tracking, banking, housing, or family.

---

## 10. FOOTER, every page

```
Kishan Prajapati, Boston. prajapati.kish@northeastern.edu
GitHub, LinkedIn, Google Scholar, LeetCode
Resume (PDF)
Last measured: [build date, auto-generated]
```

The resume line is a plain link labelled `Resume (PDF)` pointing at `/kishan-prajapati-resume.pdf`, per D-012.

The "last measured" line uses the site build date and is a small joke that fits the site. Auto-generate it, never hardcode it.

No tool, framework, or AI attribution appears in the footer or anywhere else on the site, per D-018. There is no "Built with" line.

Phase 6 adds a source link once the repository is public, per D-013. Until then the footer carries no repository line at all.

---

## 11. META AND SEO

- Site title: `Kishan Prajapati`
- Title template for subpages: `{page} · Kishan Prajapati`
- Meta description, home: `MS Computer Science at Northeastern. I build retrieval and NLP systems and measure them carefully. Papers, engineering notes, and a search system over 182,853 papers built on a fanless laptop.`
- Open Graph type: `profile` on home, `article` on case studies
- JSON-LD `Person` schema on home: name, url, sameAs (GitHub, LinkedIn, Scholar), affiliation Northeastern University, jobTitle "Graduate Teaching Assistant". No email in JSON-LD, no address, no telephone.
- `robots.txt`: allow everything. Sitemap at `/sitemap-index.xml`.
- Every page needs a unique `<title>` and description. No page ships with the home description.

---

## 12. FACT CORRECTIONS ALREADY APPLIED

For reference, so nobody reintroduces them from older source material.

| item | wrong version seen in source material | correct version, use this |
|---|---|---|
| CML paper title | "Transforming AI for Depression Detection..." | "A Review of Transforming AI for Depression Detection..." |
| Mentor name | Jayshri Patil | Jayashri Patil, as published |
| CML paper year | 2025 | Springer records it as 2026, volume 1612, pages 87 to 106 |
| ATCTM status | "Accepted at CML 2025" | Proposed inside the CML review chapter. Not a separate paper. |
| MoodInsight accuracy | 89 percent | 88.10 percent, published, with the 89 explained as a different system |
| Review scope | "200+ papers reviewed" | 79 references in the published bibliography. The 200+ figure describes his own hand-screening, so phrase it as screening, not as the paper's scope. |
| GDSC end date | August 2023 | September 2023 |
| Sieve build time | 6 working days | 8 working days |
| TA appointments | four | three |
| Sieve corpus in perf claims | one number | 196,893 pre-dedup for all perf figures, 182,853 live. State both. |
| Self-description | Lead AI Researcher | MS student. Nothing grander. |

---

## 13. SKILLS

Added D-078 on Kishan's instruction. Bracketed items carry the evidence he gave
for them. Unbracketed items were supplied directly by him without a specific
project citation, so they are canonical but less strongly sourced. PHP is
deliberately excluded: he is certified in it and has not used it since 2024,
and a dead skill invites a question he cannot answer well.

The first four groups render as an icon plus a label. The fifth renders as text
chips with no icon, and goes last.

### Languages
Python [Sieve], TypeScript [Sieve frontend], JavaScript [MoodLens], Java [CS 5010, taught in Java], C++ [LinkedIn top skill; GDSC competitive programming], SQL [raw SQL on every Sieve search path], Bash [shell scripting, infrastructure], HTML, CSS

### Backend and data
FastAPI [Sieve, MoodLens], Flask, Node.js [Technonite MERN], Express [Technonite MERN], PostgreSQL [Sieve], MongoDB [Technonite MERN], Docker [Sieve, Docker Compose], AWS [AWS Fundamentals Specialization, April 2024]

### ML and NLP
PyTorch, TensorFlow, Hugging Face Transformers, scikit-learn, NumPy, Pandas, Jupyter

### Frontend and tools
React [Sieve, MoodInsight], Vite [Sieve], Redux, Tailwind, Git, GitHub, Linux, LaTeX [resumes and the paper]

### Specialist, text chips only, no icons, last
pgvector, HNSW, ONNX Runtime, QLoRA, PEFT, EASSE, SciSpaCy, pg_trgm, Reciprocal Rank Fusion

These are the things that distinguish him from every other applicant with
Python and React on a grid, and none of them has a logo. Text chips are honest
and read as depth rather than as a gap.

**Placement.** Home page, between the capability cards and featured work. A
fuller version on /about.

**Jargon exception.** The Specialist group names terms that D-067 bars from
above-the-fold copy. They are permitted here because a labelled skills chip is
a name, not a claim a reader has to parse, and the group heading frames them.
