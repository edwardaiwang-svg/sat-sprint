import type { Question } from '../types'

// ============================================================================
//  SEED QUESTION BANK  —  ~52 ORIGINAL Digital SAT-style questions.
//
//  These are written from scratch to match the real Digital SAT's format,
//  phrasing, and difficulty. None are copied from College Board materials.
//
//  The set is deliberately weighted toward the student's weak spots:
//    • Standard English Conventions (commas, boundaries, agreement, modifiers)
//    • Words in Context  • "most strongly supported" inference
//    • Math: unit/area conversion and slope sign errors
//
//  For boundary/punctuation items, the words shown in the choices REPLACE the
//  blank in the prompt (that's how the real test underlines the segment).
//
//  Every `explanation` teaches the RULE and a quick test/habit; every `trap`
//  names the mistake the wrong answers are designed to cause.
// ============================================================================

export const SEED_QUESTIONS: Question[] = [
  // ===========================================================================
  //  STANDARD ENGLISH CONVENTIONS  (priority weak spot — 14 questions)
  // ===========================================================================
  {
    id: 'sec-01',
    section: 'rw',
    domain: 'Subject-verb agreement',
    skill: 'Standard English Conventions',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'The collection of rare fossils that the museum recently acquired from several private donors ___ now on display in the east wing.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['are', 'were', 'is', 'have been'],
    answer: 'is',
    explanation:
      'The verb agrees with the simple subject "collection" (singular), not the closer noun "donors." Strip out the interrupters — "of rare fossils" and "that the museum...donors" — and you are left with "The collection ... is now on display." Quick test: mentally delete everything between the subject and the verb, then check agreement.',
    trap: 'Agreeing with the nearest noun ("donors") instead of the true subject ("collection").',
  },
  {
    id: 'sec-02',
    section: 'rw',
    domain: 'Subject-verb agreement (inverted)',
    skill: 'Standard English Conventions',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Among the artifacts recovered from the sunken merchant ship ___ a single gold coin that historians had long believed lost.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['was', 'were', 'are', 'have been'],
    answer: 'was',
    explanation:
      'This sentence is inverted: the subject comes after the verb. The real subject is "a single gold coin" (singular), so the verb is "was." Test: flip it to normal order — "A single gold coin ... was among the artifacts."',
    trap: 'Matching the verb to the nearest plural noun ("artifacts"/"ship") in an inverted sentence.',
  },
  {
    id: 'sec-03',
    section: 'rw',
    domain: 'Sentence boundaries (comma splice)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Sea otters wrap themselves in kelp before they ___ natural anchor keeps them from drifting away on the current.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['sleep, this', 'sleep; this', 'sleep this', 'sleep, this,'],
    answer: 'sleep; this',
    explanation:
      'Both sides are complete sentences ("Sea otters wrap themselves in kelp before they sleep" / "this natural anchor keeps them from drifting away"). Two independent clauses cannot be joined by a comma alone — use a semicolon, a period, or a comma + FANBOYS (for, and, nor, but, or, yet, so). Test: cover the punctuation; if both sides are full sentences, a lone comma is wrong.',
    trap: 'Comma splice — joining two complete sentences with only a comma because the ideas feel related.',
  },
  {
    id: 'sec-04',
    section: 'rw',
    domain: 'Sentence boundaries (comma + conjunction)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'The factory had publicly promised to cut its ___ it has yet to install the filters that would make that reduction possible.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['emissions, but', 'emissions but', 'emissions; but', 'emissions, but,'],
    answer: 'emissions, but',
    explanation:
      'Two independent clauses joined by a coordinating conjunction (FANBOYS: for, and, nor, but, or, yet, so) take a comma BEFORE the conjunction — and you do not also add a semicolon. So: "...cut its emissions, but it has yet..." Test: comma + FANBOYS = one comma, placed before the joining word.',
    trap: 'Omitting the comma, adding a redundant semicolon with the conjunction, or floating an extra comma after "but."',
  },
  {
    id: 'sec-05',
    section: 'rw',
    domain: 'Essential vs. nonessential commas',
    skill: 'Standard English Conventions',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'The keynote ___ has advised three different national space agencies, will discuss the future of asteroid mining.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['speaker, who', 'speaker who', 'speaker; who', 'speaker: who'],
    answer: 'speaker, who',
    explanation:
      'Nonessential information is fenced by a PAIR of commas. The closing comma after "agencies" tells you a partner opening comma is required before "who." Remove the clause — "The keynote speaker will discuss..." — and the sentence still works, so the clause is nonessential. Test: see one comma closing an aside? It needs its partner.',
    trap: 'Dropping the opening comma of a nonessential clause even though the closing comma is already there.',
  },
  {
    id: 'sec-06',
    section: 'rw',
    domain: 'Essential clause (no commas)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'A ___ wins both of the major prizes in the same year almost always enjoys a sharp surge in sales.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['novel that', 'novel, that', 'novel, which', 'novel; that'],
    answer: 'novel that',
    explanation:
      'This clause is essential — it specifies WHICH novel. Essential (restrictive) clauses take no commas and use "that." Remove it and the meaning over-generalizes ("A novel almost always enjoys a surge"), proving it is essential. Test: if cutting the clause changes the meaning, keep it comma-free and use "that."',
    trap: 'Adding commas (or switching to "which") around an essential clause the sentence depends on.',
  },
  {
    id: 'sec-07',
    section: 'rw',
    domain: 'Modifiers (dangling)',
    skill: 'Standard English Conventions',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Rushing to catch the last ferry of the night, ___\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      'Mara left her backpack on the bench.',
      'the backpack was left on the bench by Mara.',
      "Mara's backpack was left on the bench.",
      "the bench still held Mara's forgotten backpack.",
    ],
    answer: 'Mara left her backpack on the bench.',
    explanation:
      'An introductory modifier attaches to the noun that comes right after the comma — and that noun must be the one performing the action. Only a person can be "rushing," so "Mara" must come first. Test: ask "who or what is rushing?" The answer has to be the first word after the comma.',
    trap: 'Letting the modifier dangle — putting a thing (backpack/bench) right after the comma so it seems to do the rushing.',
  },
  {
    id: 'sec-08',
    section: 'rw',
    domain: 'Verb tense (sequence)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'By the time the rescue team finally reached the summit, the stranded climbers ___ in their emergency shelter for nearly two days.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['had waited', 'waited', 'wait', 'will wait'],
    answer: 'had waited',
    explanation:
      'When two past events happen in sequence, the earlier one takes the past perfect (had + past participle). The waiting was already finished before the team arrived, so "had waited." Test: two past actions? Put "had" on the one that happened first.',
    trap: 'Using simple past ("waited"), which flattens the sequence between the two past events.',
  },
  {
    id: 'sec-09',
    section: 'rw',
    domain: 'Subject-verb agreement (neither/nor)',
    skill: 'Standard English Conventions',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Neither the head coach nor the assistant trainers ___ willing to comment on the injury before the league released its official report.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['were', 'was', 'is', 'has been'],
    answer: 'were',
    explanation:
      'With "neither...nor" (and "either...or"), the verb agrees with whichever subject is CLOSER to it. Here the nearer subject is "trainers" (plural), so the verb is "were." Test: find the noun right before the verb and match it.',
    trap: 'Assuming "neither" always forces a singular verb, ignoring the nearer plural subject.',
  },
  {
    id: 'sec-10',
    section: 'rw',
    domain: "Apostrophes (its vs. it's)",
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'After two difficult years, the small animation studio finally celebrated ___ first profitable quarter.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['its', "it's", 'their', "its'"],
    answer: 'its',
    explanation:
      '"Its" is the possessive; "it\'s" only ever means "it is" or "it has." A single studio is "it," not "they," and "its\'" is not a word. Test: expand to "it is" — if "it is first profitable quarter" is nonsense, use "its."',
    trap: 'Writing "it\'s" (it is) for the possessive, or "their" for a singular organization.',
  },
  {
    id: 'sec-11',
    section: 'rw',
    domain: 'Punctuation (colon before a list)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'The expedition carried only what the climbers could fit in their ___ freeze-dried meals, a compact water filter, and a single satellite phone.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['packs:', 'packs,', 'packs;', 'packs'],
    answer: 'packs:',
    explanation:
      'A colon introduces a list or explanation and must follow a COMPLETE sentence. "The expedition carried only what the climbers could fit in their packs" is complete, so a colon correctly sets up the list. Test: is everything before the colon a full sentence? If yes, a colon can introduce the list.',
    trap: 'Using a comma or semicolon (or nothing) where a colon is needed to introduce the list.',
  },
  {
    id: 'sec-12',
    section: 'rw',
    domain: 'Punctuation (subject-verb, no comma)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'In the lab, the chemistry students carefully measured how much heat the exothermic ___ into the surrounding water bath.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['reaction released', 'reaction, released', 'reaction released,', 'reaction: released'],
    answer: 'reaction released',
    explanation:
      'Never separate a subject from its verb with a single comma. "The exothermic reaction" (subject) connects directly to "released" (verb) with no punctuation. Test: do not drop a comma between the doer and its action.',
    trap: 'Inserting a comma between the subject ("reaction") and its verb ("released") just because the sentence feels long.',
  },
  {
    id: 'sec-13',
    section: 'rw',
    domain: 'Parallel structure',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'The internship taught her to analyze raw data, to draft clear summaries, and ___ her findings to senior staff.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['to present', 'presenting', 'presented', 'she presented'],
    answer: 'to present',
    explanation:
      'Items in a series must share the same grammatical form. The list is built from infinitives — "to analyze, to draft, to present." Test: each item should fit the lead-in "to ___."',
    trap: 'Breaking the parallel series by switching to an -ing form or a full clause in the last item.',
  },
  {
    id: 'sec-14',
    section: 'rw',
    domain: 'Subject-verb agreement (each of)',
    skill: 'Standard English Conventions',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Each of the city’s new electric buses ___ equipped with a wheelchair ramp and space for two mobility devices.\n\nWhich choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['is', 'are', 'were', 'have been'],
    answer: 'is',
    explanation:
      '"Each" is always singular, no matter how plural the following phrase sounds. Strip "of the city’s new electric buses" and you get "Each ... is equipped." Test: "each / every / one of the..." always takes a singular verb.',
    trap: 'Matching the verb to the plural object of the preposition ("buses") instead of the singular subject "each."',
  },

  // ===========================================================================
  //  INFORMATION AND IDEAS  (inference / "most strongly supported" — 9)
  // ===========================================================================
  {
    id: 'ii-01',
    section: 'rw',
    domain: 'Inference (most strongly supported)',
    skill: 'Information and Ideas',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Archaeologists once assumed that the ancient city’s massive granaries were built to store surplus grain for trade. Recent chemical analysis of the granary floors, however, found residue almost exclusively from seeds with little nutritional value — seeds typically reserved for religious offerings rather than for eating.\n\nWhich choice best states the conclusion the text most strongly supports?',
    choices: [
      'The granaries were most likely used for ceremonial purposes rather than for storing food for trade.',
      'The city’s residents did not engage in any long-distance trade.',
      'The ancient city suffered frequent famines because its grain stores were inadequate.',
      'Religious offerings mattered more to the city’s residents than food did.',
    ],
    answer: 'The granaries were most likely used for ceremonial purposes rather than for storing food for trade.',
    explanation:
      'A "most strongly supported" answer stays inside the evidence. The residue is mostly ceremonial-offering seeds, which points to ceremonial use over food storage. Test: can you point to the exact lines that back every word of the choice? The other options add claims (no trade, famine, what mattered more) the text never makes.',
    trap: 'Over-reaching: choices that extend beyond the evidence or contradict a stated detail feel bold but are unsupported.',
  },
  {
    id: 'ii-02',
    section: 'rw',
    domain: 'Inference (hedged claim)',
    skill: 'Information and Ideas',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'A naturalist noted that a certain orchid blooms for only a single night each year and releases its strongest scent in complete darkness. The only insect ever observed visiting the flower, a species of hawk moth, is active exclusively after dusk.\n\nWhich choice is most strongly supported by the text?',
    choices: [
      'The orchid relies entirely on the hawk moth for its survival.',
      'The orchid’s nighttime scent likely helps attract its nocturnal visitor.',
      'The hawk moth feeds only on this one species of orchid.',
      'The orchid would produce more flowers if it bloomed during the day.',
    ],
    answer: 'The orchid’s nighttime scent likely helps attract its nocturnal visitor.',
    explanation:
      'The supported inference is the modest one that simply connects two stated facts: a scent strongest in darkness + a visitor active only at night. Note the hedge "likely helps." Test: prefer "likely/suggests" over absolute words. "Relies entirely," "only," and the daytime speculation all claim more than the text shows.',
    trap: 'Picking the strong universal claim ("entirely," "only") instead of the cautious, evidence-bounded one.',
  },
  {
    id: 'ii-03',
    section: 'rw',
    domain: 'Command of evidence (support a claim)',
    skill: 'Information and Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'A student hypothesizes that a desert plant’s thick, waxy leaves are an adaptation that reduces water loss in dry climates.\n\nWhich finding, if true, would most directly support the student’s hypothesis?',
    choices: [
      'Closely related plant species that live in rainy climates have thin, smooth leaves.',
      'The plant’s flowers are pollinated mainly by nocturnal moths.',
      'The plant grows more slowly than other species in the same desert.',
      'The waxy coating gives the leaves a faint bluish-green color.',
    ],
    answer: 'Closely related plant species that live in rainy climates have thin, smooth leaves.',
    explanation:
      'Support must connect to the specific variable in the claim (water loss in a dry climate). A comparison with close relatives in wet climates isolates exactly that link: dry climate goes with thick/waxy, wet with thin/smooth. Test: ask "does this finding change my belief in THIS hypothesis?" If it is just an interesting fact, cut it.',
    trap: 'True-but-irrelevant details (pollinators, growth rate, color) that never touch water loss.',
  },
  {
    id: 'ii-04',
    section: 'rw',
    domain: 'Central idea',
    skill: 'Information and Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Although solar panels are often praised as a clean energy source, manufacturing them requires mining rare minerals and consumes significant energy. Researchers note that a panel must operate for one to three years before it produces more energy than was used to build it — after which it delivers decades of nearly emission-free power.\n\nWhich choice best states the main idea of the text?',
    choices: [
      'Solar panels are not actually a clean source of energy.',
      'Solar panels require rare minerals that are difficult to mine.',
      'Solar panels carry real upfront environmental costs but repay them over a long, clean operating life.',
      'Most people misunderstand how solar panels are manufactured.',
    ],
    answer: 'Solar panels carry real upfront environmental costs but repay them over a long, clean operating life.',
    explanation:
      'The main idea has to cover the WHOLE text, including the part after the pivot word ("after which..."). The passage balances an upfront cost against a long clean payback. Test: a main-idea answer must include both halves signaled by "although...but/after which," not just the concession.',
    trap: 'Latching onto the "although" concession (answer A) or a single supporting detail (answer B) as if it were the whole point.',
  },
  {
    id: 'ii-05',
    section: 'rw',
    domain: 'Inference (logical completion)',
    skill: 'Information and Ideas',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'A coffee shop replaced its disposable cups with a deposit system of heavy returnable mugs. In the first month, the number of cups thrown away on site dropped sharply. Yet the shop’s total waste, measured by weight, barely changed, because ___\n\nWhich choice most logically completes the text?',
    choices: [
      'customers said they preferred the taste of coffee served in ceramic mugs.',
      'the returnable mugs that were lost or broken roughly offset the weight of the disposable cups no longer thrown away.',
      'the shop began serving noticeably more customers than it had the previous month.',
      'disposable cups are generally more harmful to the environment than ceramic mugs are.',
    ],
    answer:
      'the returnable mugs that were lost or broken roughly offset the weight of the disposable cups no longer thrown away.',
    explanation:
      'A "because" completion must resolve the specific tension just described: discarded-cup counts fell, yet total weight held steady. Only broken/lost heavy mugs adding weight back explains both facts at once. Test: the right choice must account for EVERY stated fact, not just sound topical.',
    trap: 'Choosing a true or on-topic statement (taste, more customers, general harm) that does not explain why the weight stayed flat.',
  },
  {
    id: 'ii-06',
    section: 'rw',
    domain: 'Inference from data',
    skill: 'Information and Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'A library tracked how long patrons stayed after it extended its weekend hours. Visitors who arrived in the morning stayed an average of 90 minutes, while those who arrived within the final hour before closing stayed, on average, just 20 minutes.\n\nWhich choice is most strongly supported by the data?',
    choices: [
      'Patrons who arrive earlier in the day tend to spend more time in the library than those who arrive near closing.',
      'The library should open even earlier on weekends.',
      'Most of the library’s patrons arrive in the morning.',
      'Patrons would stay longer if the library never closed.',
    ],
    answer:
      'Patrons who arrive earlier in the day tend to spend more time in the library than those who arrive near closing.',
    explanation:
      'With data, the supported claim describes only the relationship that was actually measured — here, visit duration versus arrival time. Test: match the claim word-for-word to what was measured. A recommendation (open earlier), a count that was not tracked (how many arrive in the morning), and pure speculation (never closing) all go beyond the data.',
    trap: 'Turning a measured pattern into a recommendation, a head-count, or a "what if" the data never addressed.',
  },
  {
    id: 'ii-07',
    section: 'rw',
    domain: 'Inference (avoid contradiction)',
    skill: 'Information and Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Unlike its larger relative the cheetah, which sprints in short bursts, the caracal is a patient ambush hunter. It can leap nearly three meters into the air to knock birds from flight, but it rarely chases prey over long distances.\n\nWhich choice is most strongly supported by the text?',
    choices: [
      'The caracal catches prey mainly through sudden, powerful movements rather than sustained pursuit.',
      'The caracal is a faster long-distance runner than the cheetah.',
      'The caracal hunts only birds.',
      'The caracal is unable to catch any prey on the ground.',
    ],
    answer: 'The caracal catches prey mainly through sudden, powerful movements rather than sustained pursuit.',
    explanation:
      'Eliminate any choice that contradicts a stated detail or hardens a hedge. The text calls the cheetah the sprinter (so "faster runner" contradicts it) and says the caracal "rarely" chases and leaps for birds (so "only" and "unable to" overstate). The ambush + leaping detail supports "sudden, powerful movements." Test: scan for absolute words (only, never, unable, faster) and check each against the text.',
    trap: 'Choosing an answer that contradicts a stated fact or inflates "rarely" into "never/only."',
  },
  {
    id: 'ii-08',
    section: 'rw',
    domain: 'Command of evidence (weaken)',
    skill: 'Information and Ideas',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'A company claims its new app reduces stress, citing that users who opened the app every day reported feeling calmer after one month.\n\nWhich finding, if true, would most directly weaken the company’s claim?',
    choices: [
      'During the same month, the daily users also began sleeping more regularly, which is independently known to reduce stress.',
      'The app has already been downloaded several million times.',
      'Some users described the app’s visual design as appealing.',
      'Users who opened the app only once a week also felt slightly calmer.',
    ],
    answer:
      'During the same month, the daily users also began sleeping more regularly, which is independently known to reduce stress.',
    explanation:
      'To weaken a causal claim, find an alternative explanation (a confounding variable) for the same result. If better sleep also happened, the calm could come from sleep, not the app. Test: ask "could something other than the cause explain the result?" The confounder is the answer.',
    trap: 'Picking irrelevant facts (downloads, design) — or a detail that actually supports the app instead of undercutting the causal link.',
  },
  {
    id: 'ii-09',
    section: 'rw',
    domain: 'Inference (respect nuance)',
    skill: 'Information and Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'For decades, forest managers cleared every fallen log from the forest floor to reduce fire risk. Ecologists now caution that this tidiness carries a hidden cost: rotting logs are a primary nursery for tree seedlings and a habitat for the insects that many forest birds rely on.\n\nWhich choice is most strongly supported by the text?',
    choices: [
      'Removing fallen logs can unintentionally undermine the forest’s ability to regenerate and support wildlife.',
      'Fallen logs pose no real fire risk.',
      'Forest managers no longer care about preventing fires.',
      'Forest birds cannot survive without rotting logs.',
    ],
    answer: 'Removing fallen logs can unintentionally undermine the forest’s ability to regenerate and support wildlife.',
    explanation:
      'The supported inference respects the text’s nuance — a genuine trade-off. The passage grants the fire motive while noting the ecological cost, so the balanced statement fits. Test: cross out choices that contradict a stated point (fire risk was the motive) or push a hedge ("many birds rely on") into an absolute ("cannot survive").',
    trap: 'Swinging to an extreme that contradicts a conceded fact or overstates a qualified claim.',
  },

  // ===========================================================================
  //  CRAFT AND STRUCTURE  (Words in Context focus — 9)
  // ===========================================================================
  {
    id: 'cs-01',
    section: 'rw',
    domain: 'Words in context (polarity)',
    skill: 'Craft and Structure',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Far from being ___, the committee’s final report drew on dozens of interviews, four years of field data, and even the dissenting views of its own members.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    choices: ['exhaustive', 'cursory', 'impartial', 'elaborate'],
    answer: 'cursory',
    explanation:
      'The frame "Far from being ___" flips the polarity: the evidence that follows shows thoroughness, so the blank must mean the OPPOSITE — superficial, i.e., "cursory." Test: decide whether the blank should be positive or negative BEFORE choosing. Here the cues demand a negative word.',
    trap: 'Grabbing a word that matches the thorough evidence ("exhaustive") and forgetting the "Far from being" reversal.',
  },
  {
    id: 'cs-02',
    section: 'rw',
    domain: 'Words in context (most nearly means)',
    skill: 'Craft and Structure',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'The senator offered a qualified endorsement of the treaty: she supported its trade provisions but pointedly withheld judgment on its military clauses.\n\nAs used in the text, what does the word "qualified" most nearly mean?',
    choices: ['expert', 'limited', 'eligible', 'hesitant'],
    answer: 'limited',
    explanation:
      'The SAT tests the context-specific sense of a familiar word. The colon explains it: she backed part and withheld part, so the endorsement is "limited" (partial). Test: substitute each option back in — only "limited endorsement" matches "supported X but withheld Y."',
    trap: 'Reaching for the common meanings of "qualified" ("expert"/"eligible") instead of the sense the sentence defines.',
  },
  {
    id: 'cs-03',
    section: 'rw',
    domain: 'Words in context (collocation)',
    skill: 'Craft and Structure',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Critics first dismissed the composer’s late symphonies as formless, but modern analysts have come to ___ their unconventional structure as a deliberate and intricate design.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    choices: ['regard', 'tolerate', 'overlook', 'exaggerate'],
    answer: 'regard',
    explanation:
      'Both meaning and grammar point one way. The sentence reverses the early dismissal into appreciation, and only "regard ... as" fits the "___ X as Y" frame. Test: read the full structure — "regard their structure as a deliberate design" works; "tolerate/overlook/exaggerate ... as" do not.',
    trap: 'Choosing a word that half-fits the meaning ("tolerate") but breaks the "___ as" construction or muffles the positive shift.',
  },
  {
    id: 'cs-04',
    section: 'rw',
    domain: 'Words in context (cause/effect)',
    skill: 'Craft and Structure',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Because the fossil record for the period is so ___, paleontologists must often infer the existence of an entire species from a single tooth or a fragment of jaw.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    choices: ['abundant', 'fragmentary', 'ancient', 'controversial'],
    answer: 'fragmentary',
    explanation:
      'Use the cause/effect logic of "Because ... must": the blank is the CAUSE of inferring a species from tiny scraps. A sparse, broken record forces that, so "fragmentary." Test: plug the word into the causal chain and check it actually produces the stated effect.',
    trap: 'Picking the opposite ("abundant") or a true-but-inert trait ("ancient") that does not cause the inference-from-fragments.',
  },
  {
    id: 'cs-05',
    section: 'rw',
    domain: 'Words in context (degree)',
    skill: 'Craft and Structure',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'The new evidence did not so much overturn the theory as ___ it, adding nuance to claims that had once seemed absolute.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    choices: ['temper', 'endorse', 'shatter', 'ignore'],
    answer: 'temper',
    explanation:
      'The frame "not so much X as Y" makes Y a milder alternative to X (overturn). Adding nuance to absolute claims means softening them, so "temper." Test: Y should contrast with the strong word while fitting the surrounding clue ("adding nuance").',
    trap: 'Choosing another strong word ("shatter") that just restates "overturn," which the sentence explicitly denies.',
  },
  {
    id: 'cs-06',
    section: 'rw',
    domain: 'Words in context (defined by detail)',
    skill: 'Craft and Structure',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Although the documentary is visually stunning, its narration is so ___ that viewers often lose the central argument beneath a flood of tangents and asides.\n\nWhich choice completes the text with the most logical and precise word or phrase?',
    choices: ['concise', 'digressive', 'monotonous', 'rehearsed'],
    answer: 'digressive',
    explanation:
      'The nearby concrete detail pins the meaning: "a flood of tangents and asides" describes wandering off topic, i.e., "digressive." Test: find the phrase that defines the blank and match its exact sense rather than a generally negative word.',
    trap: 'Settling for any plausible criticism ("monotonous," "rehearsed") instead of the one the detail about tangents actually names.',
  },
  {
    id: 'cs-07',
    section: 'rw',
    domain: 'Text structure (sentence function)',
    skill: 'Craft and Structure',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Many gardeners believe that marigolds repel harmful insects. In controlled trials, however, plots bordered with marigolds showed pest damage nearly identical to that of unbordered plots. The flowers’ reputation, it seems, may owe more to tradition than to measurable effect.\n\nWhich choice best describes the function of the second sentence in the text as a whole?',
    choices: [
      'It presents experimental evidence that challenges the belief introduced in the first sentence.',
      'It offers a personal anecdote that supports the gardeners’ view.',
      'It introduces a new topic unrelated to marigolds.',
      'It restates the first sentence’s claim in different words.',
    ],
    answer: 'It presents experimental evidence that challenges the belief introduced in the first sentence.',
    explanation:
      'Function questions ask what a sentence DOES, not just what it says. The signal "however" plus "controlled trials" marks evidence that pushes against the opening belief. Test: name the role using the transition cue — here, contrast/challenge.',
    trap: 'Ignoring "however" and calling it a restatement, or mislabeling a controlled trial as an "anecdote."',
  },
  {
    id: 'cs-08',
    section: 'rw',
    domain: 'Purpose of the text',
    skill: 'Craft and Structure',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'This guide will not tell you which telescope to buy. Instead, it explains the two numbers that matter most — aperture and focal ratio — so that you can evaluate any telescope, at any price, for yourself.\n\nWhich choice best states the main purpose of the text?',
    choices: [
      'To recommend a specific telescope for beginners',
      'To explain principles that let readers evaluate telescopes on their own',
      'To argue that expensive telescopes are not worth the price',
      'To compare two competing telescope brands',
    ],
    answer: 'To explain principles that let readers evaluate telescopes on their own',
    explanation:
      'The purpose must match what the text says it is doing. The "Instead... so that you can..." statement of intent names the goal: teach principles for independent judgment. Test: find the explicit intent sentence and beware choices that contradict a stated disclaimer ("will not tell you which to buy").',
    trap: 'Choosing the very thing the text disavows (recommending a model) or a claim/comparison it never makes.',
  },
  {
    id: 'cs-09',
    section: 'rw',
    domain: 'Cross-text connections',
    skill: 'Craft and Structure',
    difficulty: 'hard',
    type: 'mcq',
    prompt:
      'Text 1: Economist Alvarez argues that remote work boosts productivity by eliminating commutes and giving employees control over their environment.\n\nText 2: Sociologist Brenner counters that the productivity gains of remote work fade over time, as the loss of spontaneous in-person contact slowly erodes the informal knowledge-sharing that teams depend on.\n\nBased on the texts, how would Brenner (Text 2) most likely respond to the view described in Text 1?',
    choices: [
      'By agreeing that long commutes are a serious drain on productivity',
      'By arguing that Alvarez overlooks the long-term cost of reduced in-person collaboration',
      'By denying that employees value any control over their work environment',
      'By claiming that remote work has no effect on productivity whatsoever',
    ],
    answer: 'By arguing that Alvarez overlooks the long-term cost of reduced in-person collaboration',
    explanation:
      'In cross-text response questions, apply the second author’s actual argument to the first author’s claim — and avoid extremes. Brenner’s specific point is that gains fade because in-person collaboration is lost. Test: the answer should reflect Text 2’s real objection, usually a qualification rather than total rejection.',
    trap: 'Overstating Brenner ("no effect whatsoever") or picking a point of agreement instead of his actual critique.',
  },

  // ===========================================================================
  //  EXPRESSION OF IDEAS  (transitions + rhetorical synthesis — 5)
  // ===========================================================================
  {
    id: 'eoi-01',
    section: 'rw',
    domain: 'Transitions (cause/effect)',
    skill: 'Expression of Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'The bridge’s original cables were made of iron, which is strong but prone to rust. ___ the restoration team replaced them with galvanized steel, which resists corrosion for decades.\n\nWhich choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'For example,', 'Therefore,', 'In contrast,'],
    answer: 'Therefore,',
    explanation:
      'Identify the logical relationship first. Iron rusts, so the team chose a rust-resistant replacement — that is cause to effect, which calls for "Therefore." Test: paraphrase the link as "because of this, that"; if it fits, use a result transition.',
    trap: 'Choosing a contrast word ("Nevertheless"/"In contrast") when the two sentences are actually a cause and its consequence.',
  },
  {
    id: 'eoi-02',
    section: 'rw',
    domain: 'Transitions (contrast)',
    skill: 'Expression of Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'Most rechargeable batteries lose capacity as they age. The experimental cell, ___ actually held slightly more charge after a year of daily cycling than it had when new.\n\nWhich choice completes the text with the most logical transition?',
    choices: ['likewise,', 'by contrast,', 'as a result,', 'for instance,'],
    answer: 'by contrast,',
    explanation:
      'The second sentence defies the norm stated in the first, so it needs a contrast transition: "by contrast." Test: does sentence two confirm or defy sentence one? Defy = contrast.',
    trap: 'Using "likewise" (similarity) or "as a result" (cause) for what is really a counterexample.',
  },
  {
    id: 'eoi-03',
    section: 'rw',
    domain: 'Transitions (addition)',
    skill: 'Expression of Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'The museum wanted to make its collection more accessible. It added wheelchair ramps and elevators to every floor. ___ it released an audio guide describing each major work for visitors with low vision.\n\nWhich choice completes the text with the most logical transition?',
    choices: ['However,', 'In addition,', 'Nonetheless,', 'Instead,'],
    answer: 'In addition,',
    explanation:
      'The audio guide is a SECOND measure serving the same goal (accessibility), so an addition transition fits: "In addition." Test: is this another item supporting the same point? Then use "in addition/also," not a contrast word.',
    trap: 'Reaching for a contrast/replacement word ("However," "Instead") when the sentence simply adds a related example.',
  },
  {
    id: 'eoi-04',
    section: 'rw',
    domain: 'Rhetorical synthesis',
    skill: 'Expression of Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'While researching a topic, a student has taken the following notes:\n• The axolotl is a salamander that keeps its larval features for life.\n• Unlike most amphibians, it never undergoes full metamorphosis.\n• It can regrow lost limbs, parts of its heart, and even portions of its brain.\n• Scientists study it to understand tissue regeneration.\n\nThe student wants to emphasize the axolotl’s regenerative ability. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The axolotl, a salamander that never fully metamorphoses, keeps its larval features for life.',
      'Because it can regrow limbs, heart tissue, and even parts of its brain, the axolotl is a key model for studying regeneration.',
      'The axolotl is a salamander, a type of amphibian.',
      'Unlike most amphibians, the axolotl does not undergo full metamorphosis.',
    ],
    answer:
      'Because it can regrow limbs, heart tissue, and even parts of its brain, the axolotl is a key model for studying regeneration.',
    explanation:
      'In synthesis questions, the stated GOAL decides the answer. The goal is to emphasize regeneration, so the choice built from the regrowth notes wins. Test: underline the goal, then pick the option centered on exactly that idea.',
    trap: 'Selecting an accurate sentence that emphasizes the wrong feature (metamorphosis or classification) instead of regeneration.',
  },
  {
    id: 'eoi-05',
    section: 'rw',
    domain: 'Rhetorical synthesis (contrast goal)',
    skill: 'Expression of Ideas',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'While researching a topic, a student has taken the following notes:\n• The violin and the viola each have four strings.\n• The viola is larger than the violin and is tuned a fifth lower.\n• The violin’s lowest string is a G; the viola’s is a C.\n• The viola produces a deeper, warmer tone.\n\nThe student wants to highlight a difference between the violin and the viola. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The violin and the viola each have four strings.',
      'The viola, larger than the violin and tuned a fifth lower, produces a deeper, warmer tone.',
      'Both the violin and the viola are bowed string instruments.',
      'The violin has four strings and is tuned in fifths.',
    ],
    answer: 'The viola, larger than the violin and tuned a fifth lower, produces a deeper, warmer tone.',
    explanation:
      'A "highlight a difference" goal requires a choice that names both instruments AND a point of contrast. Only the option pairing the viola against the violin (larger, lower, warmer) does that. Test: does the choice mention both items and how they differ?',
    trap: 'Choosing a sentence that stresses a similarity, or that describes only one of the two instruments.',
  },

  // ===========================================================================
  //  ALGEBRA  (incl. slope sign errors — 4)
  // ===========================================================================
  {
    id: 'alg-01',
    section: 'math',
    domain: 'Slopes (sign errors)',
    skill: 'Algebra',
    difficulty: 'medium',
    type: 'grid',
    prompt: 'Line k passes through the points (-2, 5) and (3, -10). What is the slope of line k?',
    answer: '-3',
    explanation:
      'Slope = (y2 - y1) / (x2 - x1) = (-10 - 5) / (3 - (-2)) = -15 / 5 = -3. Keep the SAME point order on top and bottom, and remember that subtracting a negative adds: 3 - (-2) = 5. Test: re-check each sign before dividing.',
    trap: 'Sign slips: writing 3 - (-2) as 1, or mishandling -10 - 5, which flips the slope’s sign or size.',
  },
  {
    id: 'alg-02',
    section: 'math',
    domain: 'Linear models (interpret slope)',
    skill: 'Algebra',
    difficulty: 'easy',
    type: 'mcq',
    prompt:
      'A submarine descends at a constant rate. Its depth d, in meters below the surface, after t minutes is given by d = 12t + 30. Which statement best interprets the number 12 in this equation?',
    choices: [
      'The submarine begins at a depth of 12 meters.',
      'The submarine descends 12 meters each minute.',
      'The submarine descends 30 meters each minute.',
      'The submarine reaches a depth of 12 meters after one minute.',
    ],
    answer: 'The submarine descends 12 meters each minute.',
    explanation:
      'In y = mx + b, the coefficient m is the rate of change (per unit of x) and b is the starting value. Here 12 multiplies t (minutes), so it is meters per minute; 30 is the starting depth. Test: the number attached to the variable is the "per" rate.',
    trap: 'Confusing the slope (rate) with the y-intercept (starting value, 30).',
  },
  {
    id: 'alg-03',
    section: 'math',
    domain: 'Systems of equations',
    skill: 'Algebra',
    difficulty: 'medium',
    type: 'grid',
    prompt:
      'At a farm stand, 3 apples and 2 pears cost $7.40, while 1 apple and 2 pears cost $4.40. What is the cost, in dollars, of one apple?',
    answer: '1.5',
    explanation:
      'Subtract the equations to eliminate the matching "2 pears": (3a + 2p) - (a + 2p) = 7.40 - 4.40, so 2a = 3.00 and a = 1.50. Test: when two equations share an identical term, subtract to cancel it.',
    trap: 'Solving for the wrong variable (the pear) or losing a sign during the subtraction.',
  },
  {
    id: 'alg-04',
    section: 'math',
    domain: 'Inequalities (sign flip)',
    skill: 'Algebra',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'For which value of x is the inequality -2x + 5 > 11 true?',
    choices: ['x = -2', 'x = -3', 'x = 0', 'x = -4'],
    answer: 'x = -4',
    explanation:
      'Solve: -2x + 5 > 11, so -2x > 6. Dividing both sides by -2 FLIPS the inequality: x < -3. Of the choices, only x = -4 is less than -3. Test: dividing or multiplying by a negative reverses the inequality sign; then sanity-check by plugging in.',
    trap: 'Forgetting to flip the inequality when dividing by a negative, which makes you pick x = 0 or x = -2.',
  },

  // ===========================================================================
  //  ADVANCED MATH  (3)
  // ===========================================================================
  {
    id: 'adv-01',
    section: 'math',
    domain: 'Quadratics (sum of roots)',
    skill: 'Advanced Math',
    difficulty: 'medium',
    type: 'grid',
    prompt: 'The function f is defined by f(x) = x² - 6x + 8. What is the sum of the values of x for which f(x) = 0?',
    answer: '6',
    explanation:
      'For a x² + b x + c = 0, the sum of the roots is -b/a and the product is c/a. Here -b/a = -(-6)/1 = 6 (you can verify by factoring: roots 2 and 4, which sum to 6). Test: you can read the sum of roots straight off the equation without solving.',
    trap: 'Reporting the product (8) instead of the sum, or dropping the sign and getting -6.',
  },
  {
    id: 'adv-02',
    section: 'math',
    domain: 'Exponential models',
    skill: 'Advanced Math',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'A population of bacteria is modeled by P(t) = 200 · 2^(t/3), where t is measured in hours. According to the model, how many hours does it take for the population to double?',
    choices: ['2 hours', '3 hours', '6 hours', '200 hours'],
    answer: '3 hours',
    explanation:
      'In a · b^(t/k), the quantity multiplies by the base b every k units of t. Here the base is 2 (doubling) and the exponent is t/3, so it doubles every 3 hours. Test: when the base is 2, the number under t is the doubling time.',
    trap: 'Reading off the wrong number — the base (2), the starting amount (200) — instead of the period in the exponent.',
  },
  {
    id: 'adv-03',
    section: 'math',
    domain: 'Functions (vertex form)',
    skill: 'Advanced Math',
    difficulty: 'medium',
    type: 'grid',
    prompt: 'The function g is defined by g(x) = (x + 3)² - 4. What is the minimum value of g(x)?',
    answer: '-4',
    explanation:
      'In vertex form a(x - h)² + k with a > 0, the minimum value is k, reached when the squared term is 0. Here the squared part is never negative, so the smallest g can be is -4 (at x = -3). Test: the constant added outside the square is the minimum when the parabola opens up.',
    trap: 'Plugging in x = 0 (giving 5) or reading the vertex’s x-value (-3) as the minimum.',
  },

  // ===========================================================================
  //  PROBLEM-SOLVING AND DATA ANALYSIS  (incl. unit conversion — 4)
  // ===========================================================================
  {
    id: 'psda-01',
    section: 'math',
    domain: 'Unit conversion (rate)',
    skill: 'Problem-Solving and Data Analysis',
    difficulty: 'easy',
    type: 'grid',
    prompt: 'A printer produces 18 pages per minute. At this rate, how many pages does it produce in 2 hours?',
    answer: '2160',
    explanation:
      'Convert the time to match the rate’s units first: 2 hours = 120 minutes. Then 18 pages/min × 120 min = 2160 pages. Test: before multiplying, make the time unit match the "per" unit of the rate.',
    trap: 'Multiplying 18 by 2 (hours) instead of 120 (minutes) and getting 36.',
  },
  {
    id: 'psda-02',
    section: 'math',
    domain: 'Percentages (sequential)',
    skill: 'Problem-Solving and Data Analysis',
    difficulty: 'medium',
    type: 'grid',
    prompt:
      'A jacket priced at $80 is discounted by 25%. A 10% sales tax is then applied to the discounted price. What is the final amount paid, in dollars?',
    answer: '66',
    explanation:
      'Apply the percent changes one at a time, as multipliers: 80 × 0.75 = 60 (after the discount), then 60 × 1.10 = 66 (after tax). Test: chain the multipliers in order; never just add or subtract the percents, since they act on different bases.',
    trap: 'Combining 25% and 10% into a single 15% change, or applying the tax to the original $80.',
  },
  {
    id: 'psda-03',
    section: 'math',
    domain: 'Ratios and proportions (units)',
    skill: 'Problem-Solving and Data Analysis',
    difficulty: 'medium',
    type: 'grid',
    prompt:
      'A map uses a scale of 2 centimeters to 5 kilometers. Two towns are 14 centimeters apart on the map. How far apart, in kilometers, are the towns in reality?',
    answer: '35',
    explanation:
      'Set up the conversion so the unit you do not want cancels: 14 cm × (5 km / 2 cm) = 35 km. The "cm" cancels, leaving km. Test: write the conversion factor with the desired unit on top so the wrong unit divides out.',
    trap: 'Inverting the ratio (multiplying by 2/5 and getting 5.6) so the units do not cancel.',
  },
  {
    id: 'psda-04',
    section: 'math',
    domain: 'Statistics (mean)',
    skill: 'Problem-Solving and Data Analysis',
    difficulty: 'medium',
    type: 'grid',
    prompt: 'The mean of five numbers is 12. Four of the numbers are 9, 11, 13, and 7. What is the fifth number?',
    answer: '20',
    explanation:
      'Reconstruct the total first: mean × count = 12 × 5 = 60. The four known numbers sum to 40, so the fifth is 60 - 40 = 20. Test: with an average, find the total (mean × count), then subtract what you already know.',
    trap: 'Forgetting to multiply the mean by the count, or dividing instead of subtracting.',
  },

  // ===========================================================================
  //  GEOMETRY AND TRIGONOMETRY  (incl. area unit conversion — 4)
  // ===========================================================================
  {
    id: 'geo-01',
    section: 'math',
    domain: 'Area unit conversion (square the factor)',
    skill: 'Geometry and Trigonometry',
    difficulty: 'medium',
    type: 'grid',
    prompt: 'A square garden has an area of 9 square meters. What is its area in square centimeters? (1 meter = 100 centimeters)',
    answer: '90000',
    explanation:
      'For AREAS you must SQUARE the linear conversion factor: 1 m = 100 cm, so 1 m² = 100² = 10,000 cm². Then 9 m² × 10,000 = 90,000 cm². Test: lengths use the factor, areas square it, volumes cube it.',
    trap: 'Multiplying by 100 instead of 100² (getting 900) by forgetting to square the factor for area.',
  },
  {
    id: 'geo-02',
    section: 'math',
    domain: 'Area unit conversion (square the factor)',
    skill: 'Geometry and Trigonometry',
    difficulty: 'medium',
    type: 'mcq',
    prompt:
      'A rectangular field measures 3 meters by 4 meters. What is its area in square centimeters? (1 meter = 100 centimeters)',
    choices: ['1,200 cm²', '12 cm²', '120,000 cm²', '1,200,000 cm²'],
    answer: '120,000 cm²',
    explanation:
      'Two safe routes. (1) Convert the sides first: 300 cm × 400 cm = 120,000 cm². (2) Or find 12 m² and multiply by 100² = 10,000, giving 120,000 cm². Test: converting the side lengths BEFORE multiplying makes the squared factor automatic.',
    trap: 'Finding 12 m² and multiplying by only 100 (getting 1,200), forgetting that area squares the factor.',
  },
  {
    id: 'geo-03',
    section: 'math',
    domain: 'Circles (circumference and area)',
    skill: 'Geometry and Trigonometry',
    difficulty: 'medium',
    type: 'mcq',
    prompt: 'A circle has a circumference of 10π centimeters. What is its area?',
    choices: ['10π cm²', '25π cm²', '100π cm²', '5π cm²'],
    answer: '25π cm²',
    explanation:
      'Use the radius as the bridge. From C = 2πr = 10π, the radius r = 5. Then area = πr² = π(5)² = 25π cm². Test: always solve for r first, then plug into the area formula.',
    trap: 'Using r = 10 (skipping the divide-by-2 in C = 2πr) and getting 100π.',
  },
  {
    id: 'geo-04',
    section: 'math',
    domain: 'Right-triangle trigonometry',
    skill: 'Geometry and Trigonometry',
    difficulty: 'medium',
    type: 'grid',
    prompt:
      'In right triangle ABC, the right angle is at C. If sin(A) = 3/5 and the hypotenuse AB has length 20, what is the length of side BC?',
    answer: '12',
    explanation:
      'Sine = opposite / hypotenuse (SOH). BC is opposite angle A, so sin(A) = BC / AB. Then BC = 20 × (3/5) = 12. Test: label opposite, adjacent, and hypotenuse relative to the named angle BEFORE choosing the ratio.',
    trap: 'Using the wrong side (adjacent) or multiplying by 5/3 instead of 3/5.',
  },
]
