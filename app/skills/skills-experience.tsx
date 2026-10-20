"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, ChevronDown, CircleUserRound,
  Compass, GraduationCap, Heart, LoaderCircle, Plus, Search, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase-client";
import styles from "./skills.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const branches = ["Computer Science & Engineering", "Information Technology", "Artificial Intelligence & Data Science", "Electronics & Communication", "Electrical & Electronics", "Mechanical Engineering", "Civil Engineering", "Business & Management", "Arts & Humanities", "Science", "Other"];
const skillSuggestions = ["Programming", "JavaScript", "Python", "UI/UX Design", "Communication", "Leadership", "Problem Solving", "Public Speaking", "Data Science", "Graphic Design", "Project Management", "Photography"];
const interestGroups = [
  { name: "Technology", tone: "blue", tags: ["Technology", "AI", "Artificial Intelligence", "Cybersecurity", "AWS", "LLM", "ChatGPT", "UX", "UX Design", "Android", "iOS", "Apple", "AI Agent", "Future Tech", "Kubernetes"] },
  { name: "Programming", tone: "green", tags: ["Programming", "Data Science", "Software Development", "Python", "Software Engineering", "Machine Learning", "DevOps", "Web Development", "Data Engineering", "Java", "JavaScript", "Flutter", "Deep Learning", "React"] },
  { name: "Wellness", tone: "rose", tags: ["Psychology", "Self Improvement", "Mental Health", "Productivity", "Spirituality", "Personal Growth", "Wellness", "Mindfulness", "Fitness", "Personal Development", "Motivation", "Sports"] },
  { name: "Life", tone: "gold", tags: ["Life", "Relationships", "Love", "Life Lessons", "Health", "Travel", "Lifestyle", "Family", "Parenting", "Faith", "Healing", "Sexuality"] },
  { name: "Society", tone: "blue", tags: ["Politics", "Women", "History", "Society", "News", "War", "Economics", "Religion", "Christianity", "Feminism", "Geopolitics", "World", "Justice", "Equality", "Ukraine War"] },
  { name: "Culture", tone: "plum", tags: ["Science", "Writing", "Culture", "Philosophy", "Education", "Books", "Humor", "Space", "Inspiration", "Creativity", "Art", "Music", "Gaming", "Math"] },
  { name: "Business", tone: "teal", tags: ["Business", "Money", "Entrepreneurship", "Leadership", "Startup", "Careers", "Finance", "Investing", "Work", "Marketing", "Cryptocurrency"] },
];
const experienceOptions = ["1st year", "2nd year", "3rd year", "4th year", "5th year or above", "Recent graduate", "Working professional"];
const foodSuggestions = ["Biryani", "Dosa", "Pizza", "Pasta", "Street food", "Sweets", "Coffee", "Tea"];
const allInterestOptions = new Set(interestGroups.flatMap((group) => group.tags));

function readArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function TagField({ label, hint, values, draft, setDraft, onAdd, onRemove, placeholder, suggestions, id }: {
  label: string; hint?: string; values: string[]; draft: string; setDraft: (value: string) => void;
  onAdd: (value: string) => void; onRemove: (value: string) => void; placeholder: string;
  suggestions?: string[]; id: string;
}) {
  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") { event.preventDefault(); onAdd(draft); }
    if (event.key === "Backspace" && !draft && values.length) onRemove(values[values.length - 1]);
  }
  return <fieldset className={styles.fieldset}>
    <legend>{label}{hint && <small>{hint}</small>}</legend>
    <div className={styles.tagBox}>
      {values.map((value) => <span className={styles.tag} key={value}>{value}<button type="button" aria-label={`Remove ${value}`} onClick={() => onRemove(value)}><X size={14} aria-hidden="true" /></button></span>)}
      <input id={id} aria-label={label} value={draft} maxLength={40} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKey} onBlur={() => { if (draft.trim()) onAdd(draft); }} placeholder={placeholder} />
      <button className={styles.addButton} type="button" aria-label={`Add ${label.toLowerCase()}`} onClick={() => onAdd(draft)}><Plus size={17} aria-hidden="true" /></button>
    </div>
    {suggestions?.length ? <div className={styles.suggestions} aria-label={`${label} suggestions`}>{suggestions.filter((item) => !values.includes(item)).map((item) => <button type="button" key={item} onClick={() => onAdd(item)}>{item}<Plus size={12} aria-hidden="true" /></button>)}</div> : null}
  </fieldset>;
}

export function SkillsExperience() {
  const [user, setUser] = useState<User | null>(null);
  const [configured] = useState(isSupabaseConfigured());
  const [checking, setChecking] = useState(() => isSupabaseConfigured());
  const [branch, setBranch] = useState("");
  const [otherBranch, setOtherBranch] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [interestDraft, setInterestDraft] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [culture, setCulture] = useState<string[]>([]);
  const [cultureDraft, setCultureDraft] = useState("");
  const [foods, setFoods] = useState<string[]>([]);
  const [foodDraft, setFoodDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError || !data.user) { window.location.replace(`${basePath}/login/?next=%2Fskills%2F`); return; }
      const metadata = data.user.user_metadata;
      setUser(data.user);
      setBranch(String(metadata.profile_branch_category ?? metadata.profile_branch ?? ""));
      setOtherBranch(String(metadata.profile_branch_details ?? ""));
      setExperience(String(metadata.profile_experience ?? ""));
      setSkills(readArray(metadata.profile_skills));
      const savedInterests = readArray(metadata.profile_interests);
      setInterests(savedInterests.filter((item) => allInterestOptions.has(item)));
      setCustomInterests(savedInterests.filter((item) => !allInterestOptions.has(item)));
      setCulture(readArray(metadata.profile_culture));
      setFoods(readArray(metadata.profile_favorite_foods));
      setChecking(false);
    }).catch(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  function addValue(value: string, values: string[], update: (values: string[]) => void, clear: () => void, limit = 12) {
    const normalized = value.trim().replace(/,+$/, "").trim();
    if (!normalized || values.length >= limit || values.some((item) => item.toLowerCase() === normalized.toLowerCase())) return;
    update([...values, normalized]); clear(); setSaved(false); setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSaved(false);
    if (!skills.length) { setError("Add at least one skill to continue."); return; }
    if (!interests.length && !customInterests.length) { setError("Choose at least one interest to continue."); return; }
    const supabase = getSupabaseClient();
    if (!supabase) { setError("Secure profile saving is not configured yet. Add the Supabase project URL and publishable key first."); return; }
    setBusy(true);
    const { data, error: updateError } = await supabase.auth.updateUser({ data: {
      profile_branch: branch === "Other" ? otherBranch.trim() : branch,
      profile_branch_category: branch,
      profile_branch_details: branch === "Other" ? otherBranch.trim() : "",
      profile_experience: experience,
      profile_skills: skills,
      profile_interests: [...interests, ...customInterests],
      profile_culture: culture,
      profile_favorite_foods: foods,
      profile_complete: true,
    } });
    setBusy(false);
    if (updateError) { setError("We couldn’t save your details. Check your connection and try again."); return; }
    if (data.user) setUser(data.user);
    setSaved(true);
  }

  const displayName = String(user?.user_metadata.full_name ?? user?.user_metadata.name ?? user?.email?.split("@")[0] ?? "Your profile");
  const selectedInterests = [...interests, ...customInterests];
  const normalizedInterestSearch = interestSearch.trim().toLocaleLowerCase();
  const filteredInterestGroups = interestGroups.map((group) => ({ ...group, tags: group.tags.filter((tag) => tag.toLocaleLowerCase().includes(normalizedInterestSearch)) })).filter((group) => group.tags.length > 0);
  const selectedCount = skills.length + selectedInterests.length + culture.length + foods.length;

  return <main className={styles.page}>
    <header className={styles.header}>
      <a className={styles.brand} href={`${basePath}/`} aria-label="Collexus home"><span className={styles.logoFrame}><Image src={`${basePath}/collexus-logo.svg`} alt="" width={32} height={32} /></span><span>Collexus</span></a>
      <a className={styles.backLink} href={`${basePath}/`}><ArrowLeft size={16} aria-hidden="true" /> Back to events</a>
    </header>
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div><p className={styles.eyebrow}><Sparkles size={14} aria-hidden="true" /> YOUR CAMPUS PROFILE</p><h1>Show them what<br /><em>you bring to campus.</em></h1><p className={styles.heroText}>Add your skills, study details and the things you love. Find your people, your next team and more events that feel like you.</p><div className={styles.privacyPill}><ShieldCheck size={15} aria-hidden="true" /> You choose what to share</div></div>
        <aside className={styles.heroCard}><div className={styles.heroCardIcon}><CircleUserRound size={23} aria-hidden="true" /></div><p>YOUR PROFILE, YOUR WAY</p><strong>A little detail can spark a great connection.</strong><span>Update these details whenever you like.</span></aside>
      </section>
      <div className={styles.progressWrap}><div className={styles.progressTrack}><span style={{ width: `${Math.min(100, 24 + selectedCount * 5)}%` }} /></div><p><strong>{selectedCount}</strong> details added <span>·</span> About 2 minutes</p></div>
      {checking ? <div className={styles.notice}><LoaderCircle className={styles.spinner} size={21} aria-hidden="true" /> Checking your account…</div> : !user ? <section className={styles.notice}><ShieldCheck size={23} aria-hidden="true" /><div><h2>{configured ? "Sign in to complete your profile" : "Account setup is almost ready"}</h2><p>{configured ? "Sign in and we’ll bring you back here." : "Supabase needs a project URL and publishable key before an account can be loaded or saved."}</p><a className={styles.primaryButton} href={`${basePath}/login/?next=%2Fskills%2F`}>Go to sign in <ArrowRight size={17} aria-hidden="true" /></a></div></section> : <div className={styles.contentGrid}>
        <form className={styles.form} onSubmit={save}>
          <div className={styles.sectionHead}><span className={styles.headingIcon}><GraduationCap size={21} aria-hidden="true" /></span><div><p className={styles.sectionKicker}>01 — THE BASICS</p><h2>Where are you on your journey?</h2><p>Help classmates and organizers understand your background.</p></div></div>
          <div className={styles.fieldGrid}>
            <label className={styles.field}><span>Your branch <b>*</b></span><span className={styles.selectWrap}><Compass size={16} aria-hidden="true" /><select required value={branch} onChange={(event) => { setBranch(event.target.value); setSaved(false); }}><option value="">Choose your branch</option>{branches.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
            {branch === "Other" && <label className={styles.field}><span>Enter your branch <b>*</b></span><input className={styles.textInput} required maxLength={80} value={otherBranch} onChange={(event) => { setOtherBranch(event.target.value); setSaved(false); }} placeholder="e.g. Biotechnology" /></label>}
            <label className={styles.field}><span>Year / experience <b>*</b></span><span className={styles.selectWrap}><BookOpen size={16} aria-hidden="true" /><select required value={experience} onChange={(event) => { setExperience(event.target.value); setSaved(false); }}><option value="">Choose your year</option>{experienceOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
          </div>
          <TagField id="skills-entry" label="Your skills" hint="Required · add up to 12" values={skills} draft={skillDraft} setDraft={setSkillDraft} onAdd={(value) => addValue(value, skills, setSkills, () => setSkillDraft(""))} onRemove={(value) => { setSkills((current) => current.filter((item) => item !== value)); setSaved(false); }} placeholder="Type a skill and press Enter" suggestions={skillSuggestions} />
          <section className={styles.groupSection} aria-labelledby="interest-title"><div className={styles.groupHeading}><div><p className={styles.sectionKicker}>02 — WHAT YOU LOVE</p><h2 id="interest-title">Pick your interests <small>* choose at least one</small></h2></div><span className={styles.countBadge}>{selectedInterests.length} selected</span></div>
            <label className={styles.interestSearch}><Search size={16} aria-hidden="true" /><input type="search" value={interestSearch} onChange={(event) => setInterestSearch(event.target.value)} placeholder="Search interests" aria-label="Search interest categories" /></label>
            <div className={styles.groups}>{filteredInterestGroups.map((group) => <fieldset className={`${styles.interestGroup} ${styles[group.tone]}`} key={group.name}><legend>{group.name}</legend><div className={styles.chips}>{group.tags.map((tag) => { const selected = interests.includes(tag); return <button type="button" className={selected ? styles.chipSelected : styles.chip} aria-pressed={selected} key={tag} onClick={() => { setInterests((current) => selected ? current.filter((item) => item !== tag) : [...current, tag]); setSaved(false); }}>{selected && <Check size={13} aria-hidden="true" />}{tag}</button>; })}</div></fieldset>)}{!filteredInterestGroups.length && <p className={styles.noResults}>No matching interests. Add your own below.</p>}</div>
            <TagField id="custom-interest-entry" label="Add your own interests" hint="Optional · type a tag and press Enter" values={customInterests} draft={interestDraft} setDraft={setInterestDraft} onAdd={(value) => addValue(value, customInterests, setCustomInterests, () => setInterestDraft(""))} onRemove={(value) => { setCustomInterests((current) => current.filter((item) => item !== value)); setSaved(false); }} placeholder="Add a topic that’s not listed" />
          </section>
          <TagField id="culture-entry" label="Culture, languages & communities" hint="Optional · add what feels like you" values={culture} draft={cultureDraft} setDraft={setCultureDraft} onAdd={(value) => addValue(value, culture, setCulture, () => setCultureDraft(""))} onRemove={(value) => { setCulture((current) => current.filter((item) => item !== value)); setSaved(false); }} placeholder="e.g. Telugu, classical dance, anime" />
          <TagField id="food-entry" label="Foods you love" hint="Optional · help friends plan the next food run" values={foods} draft={foodDraft} setDraft={setFoodDraft} onAdd={(value) => addValue(value, foods, setFoods, () => setFoodDraft(""))} onRemove={(value) => { setFoods((current) => current.filter((item) => item !== value)); setSaved(false); }} placeholder="Add a favorite food" suggestions={foodSuggestions} />
          {error && <p className={styles.error} role="alert">{error}</p>}{saved && <p className={styles.success} role="status"><BadgeCheck size={17} aria-hidden="true" /> Your skills and interests are saved.</p>}
          {!configured && <p className={styles.setupNotice}>Supabase is not configured yet, so saving is disabled until its project URL and publishable key are added.</p>}
          <div className={styles.actions}><button className={styles.primaryButton} type="submit" disabled={busy || !configured}>{busy ? <><LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> Saving…</> : <>Save my details <ArrowRight size={17} aria-hidden="true" /></>}</button><a href={`${basePath}/#featured-events`}>Maybe later</a></div>
        </form>
        <aside className={styles.preview} aria-label="Live profile preview"><div className={styles.previewTop}><span>YOUR PROFILE CARD</span><span className={styles.live}><i /> LIVE PREVIEW</span></div><div className={styles.previewBody}><div className={styles.avatar}>{displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "C"}</div><span className={styles.memberBadge}>COLLEXUS MEMBER</span><h3>{displayName}</h3><p className={styles.email}>{user.email}</p><div className={styles.divider} /><p className={styles.previewLabel}><GraduationCap size={14} aria-hidden="true" /> STUDYING</p><p className={styles.previewValue}>{branch || "Your branch"}</p><p className={styles.previewMeta}>{experience || "Your year / experience"}</p><p className={styles.previewLabel}><Sparkles size={14} aria-hidden="true" /> SKILLS</p><div className={styles.previewChips}>{skills.length ? skills.slice(0, 5).map((item) => <span key={item}>{item}</span>) : <small>Add skills to show them here</small>}</div><p className={styles.previewLabel}><Heart size={14} aria-hidden="true" /> INTERESTS</p><div className={styles.previewChips}>{selectedInterests.length ? selectedInterests.slice(0, 5).map((item) => <span key={item}>{item}</span>) : <small>Choose what you enjoy</small>}</div>{culture.length > 0 && <p className={styles.previewMeta}>Culture · {culture.slice(0, 3).join(", ")}</p>}{foods.length > 0 && <p className={styles.previewMeta}>Food · {foods.slice(0, 3).join(", ")}</p>}</div><div className={styles.previewFoot}><ShieldCheck size={16} aria-hidden="true" /><span>Share only what you’re comfortable sharing.</span></div></aside>
      </div>}
      <footer className={styles.footer}><span>© 2026 Collexus</span><span>Find your people. Find your next experience.</span></footer>
    </div>
  </main>;
}
