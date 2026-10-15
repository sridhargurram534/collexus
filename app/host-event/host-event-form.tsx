"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Eye,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import styles from "./host-event.module.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type FormState = {
  organizerName: string;
  occupation: string;
  institution: string;
  institutionOther: string;
  batch: string;
  email: string;
  phone: string;
  eventName: string;
  category: string;
  template: string;
  about: string;
  expectedParticipants: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  mode: string;
  venue: string;
  pricing: "free" | "paid";
  price: string;
};

const initialForm: FormState = {
  organizerName: "",
  occupation: "",
  institution: "",
  institutionOther: "",
  batch: "",
  email: "",
  phone: "",
  eventName: "",
  category: "",
  template: "",
  about: "",
  expectedParticipants: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  mode: "",
  venue: "",
  pricing: "free",
  price: "",
};

const fieldTitles: Record<string, string> = {
  "1": "First year",
  "2": "Second year",
  "3": "Third year",
  "4": "Final year",
  "faculty": "Faculty & staff",
  "all": "All batches",
};

function formatDate(value: string) {
  if (!value) return "Date to be announced";
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? "Date to be announced"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

export function HostEventForm() {
  const [form, setForm] = useState(initialForm);
  const [reviewed, setReviewed] = useState(false);
  const [dateError, setDateError] = useState("");

  function update<K extends keyof FormState>(key: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      setForm((current) => ({ ...current, [key]: value }));
      setReviewed(false);
      setDateError("");
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startsAt = new Date(`${form.startDate}T${form.startTime}`);
    const endsAt = new Date(`${form.endDate}T${form.endTime}`);
    if (endsAt <= startsAt) {
      setDateError("The end date and time must be after the start date and time.");
      document.getElementById("host-end-date")?.focus();
      return;
    }
    setDateError("");
    setReviewed(true);
  }

  const dates = form.startDate
    ? `${formatDate(form.startDate)}${form.endDate && form.endDate !== form.startDate ? ` – ${formatDate(form.endDate)}` : ""}`
    : "Dates to be announced";
  const selectedAudience = fieldTitles[form.batch] ?? "Choose an audience";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href={`${publicBasePath}/`} aria-label="Collexus home">
          <img src={`${publicBasePath}/collexus-logo.svg`} alt="" width="40" height="40" />
          <span>Collexus</span>
        </a>
        <a className={styles.backLink} href={`${publicBasePath}/#featured-events`}>
          <ArrowLeft aria-hidden="true" size={17} />
          <span>Back to events</span>
        </a>
      </header>

      <div className={styles.shell}>
        <section className={styles.intro} aria-labelledby="host-title">
          <div className={styles.eyebrow}>EVENT SUBMISSION</div>
          <h1 id="host-title">Put your event<br className={styles.desktopBreak} /> on the campus map.</h1>
          <p>Share the details with students and faculty. We’ll help make your event easy to find.</p>
          <div className={styles.formNote}><span>*</span> Required fields</div>
        </section>

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section} aria-labelledby="organizer-heading">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div><h2 id="organizer-heading">Organizer details</h2><p>Who should we contact about this event?</p></div>
              </div>
              <div className={styles.fields}>
                <label className={`${styles.field} ${styles.spanTwo}`}>
                  <span>Your name <b aria-hidden="true">*</b></span>
                  <input autoComplete="name" name="organizerName" onChange={update("organizerName")} placeholder="e.g. Ananya Rao" required value={form.organizerName} />
                </label>
                <label className={styles.field}>
                  <span>Occupation <b aria-hidden="true">*</b></span>
                  <select name="occupation" onChange={update("occupation")} required value={form.occupation}>
                    <option value="" disabled>Select occupation</option>
                    <option>Student</option><option>Faculty</option><option>Staff</option><option>Alumni</option><option>External organizer</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Institution <b aria-hidden="true">*</b></span>
                  <select name="institution" onChange={update("institution")} required value={form.institution}>
                    <option value="" disabled>Select institution</option>
                    <option>Ramachandra College of Engineering</option><option>Other institution</option>
                  </select>
                </label>
                {form.institution === "Other institution" && <label className={`${styles.field} ${styles.spanTwo}`}>
                  <span>Institution name <b aria-hidden="true">*</b></span>
                  <input autoComplete="organization" name="institutionOther" onChange={update("institutionOther")} placeholder="Enter your college or organization" required value={form.institutionOther} />
                </label>}
                <label className={styles.field}>
                  <span>Email address <b aria-hidden="true">*</b></span>
                  <input autoComplete="email" name="email" onChange={update("email")} placeholder="you@college.edu" required type="email" value={form.email} />
                </label>
                <label className={styles.field}>
                  <span>Phone number <b aria-hidden="true">*</b></span>
                  <input autoComplete="tel" inputMode="tel" name="phone" onChange={update("phone")} pattern="[+0-9() .-]{7,20}" placeholder="+91 98765 43210" required type="tel" value={form.phone} />
                  <small>Include your country code so we can reach you.</small>
                </label>
              </div>
            </section>

            <section className={styles.section} aria-labelledby="event-heading">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>02</span>
                <div><h2 id="event-heading">Event details</h2><p>Give your listing a clear name and description.</p></div>
              </div>
              <div className={styles.fields}>
                <label className={`${styles.field} ${styles.spanTwo}`}>
                  <span>Event name <b aria-hidden="true">*</b></span>
                  <input name="eventName" onChange={update("eventName")} placeholder="e.g. Campus Innovation Week" required value={form.eventName} />
                </label>
                <label className={styles.field}>
                  <span>Category <b aria-hidden="true">*</b></span>
                  <select name="category" onChange={update("category")} required value={form.category}>
                    <option value="" disabled>Choose a category</option>
                    <option>Hackathon</option><option>Workshop</option><option>Project expo</option><option>Cultural event</option><option>Sports & outdoors</option><option>Career & internship</option><option>Branch event</option><option>Other</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Event template <b aria-hidden="true">*</b></span>
                  <select name="template" onChange={update("template")} required value={form.template}>
                    <option value="" disabled>Select a layout</option>
                    <option>Workshop or seminar</option><option>Hackathon or competition</option><option>Festival or cultural event</option><option>Sports meet</option><option>Project expo</option><option>General campus event</option>
                  </select>
                  <small>Choose the format that best fits your event.</small>
                </label>
                <label className={styles.field}>
                  <span>Eligible batch / audience <b aria-hidden="true">*</b></span>
                  <select name="batch" onChange={update("batch")} required value={form.batch}>
                    <option value="" disabled>Select eligible audience</option>
                    <option value="1">First year</option><option value="2">Second year</option><option value="3">Third year</option><option value="4">Final year</option><option value="all">All batches</option><option value="faculty">Faculty &amp; staff</option>
                  </select>
                </label>
                <label className={`${styles.field} ${styles.spanTwo}`}>
                  <span>Brief about the event <b aria-hidden="true">*</b></span>
                  <textarea maxLength={600} name="about" onChange={update("about")} placeholder="What will participants do, learn, or experience?" required rows={4} value={form.about} />
                  <small className={styles.charCount}>{form.about.length}/600 characters</small>
                </label>
              </div>
            </section>

            <section className={styles.section} aria-labelledby="schedule-heading">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>03</span>
                <div><h2 id="schedule-heading">Schedule &amp; venue</h2><p>Let people know when and where to join.</p></div>
              </div>
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>From date <b aria-hidden="true">*</b></span>
                  <input name="startDate" onChange={update("startDate")} required type="date" value={form.startDate} />
                </label>
                <label className={styles.field}>
                  <span>To date <b aria-hidden="true">*</b></span>
                  <input id="host-end-date" min={form.startDate || undefined} name="endDate" onChange={update("endDate")} required type="date" value={form.endDate} />
                </label>
                <label className={styles.field}>
                  <span>Starting time <b aria-hidden="true">*</b></span>
                  <input name="startTime" onChange={update("startTime")} required type="time" value={form.startTime} />
                </label>
                <label className={styles.field}>
                  <span>Ending time <b aria-hidden="true">*</b></span>
                  <input name="endTime" onChange={update("endTime")} required type="time" value={form.endTime} />
                </label>
                {dateError && <p className={`${styles.formError} ${styles.spanTwo}`} role="alert">{dateError}</p>}
                <label className={styles.field}>
                  <span>Event format <b aria-hidden="true">*</b></span>
                  <select name="mode" onChange={update("mode")} required value={form.mode}>
                    <option value="" disabled>Choose a format</option><option>In person</option><option>Online</option><option>Hybrid</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Venue <b aria-hidden="true">*</b></span>
                  <input autoComplete="street-address" name="venue" onChange={update("venue")} placeholder={form.mode === "Online" ? "Meeting link shared after approval" : "Building, room, or campus area"} required value={form.venue} />
                </label>
                <label className={`${styles.field} ${styles.spanTwo}`}>
                  <span>Expected number of participants <b aria-hidden="true">*</b></span>
                  <input min="1" max="100000" name="expectedParticipants" onChange={update("expectedParticipants")} placeholder="e.g. 120" required type="number" value={form.expectedParticipants} />
                  <small>A rough estimate helps attendees understand the event size.</small>
                </label>
              </div>
            </section>

            <section className={styles.section} aria-labelledby="pricing-heading">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>04</span>
                <div><h2 id="pricing-heading">Entry &amp; pricing</h2><p>Set expectations before anyone signs up.</p></div>
              </div>
              <fieldset className={styles.pricingGroup}>
                <legend>Is the event free or paid? <b aria-hidden="true">*</b></legend>
                <div className={styles.priceChoices}>
                  <label className={`${styles.priceChoice} ${form.pricing === "free" ? styles.priceChoiceActive : ""}`}>
                    <input checked={form.pricing === "free"} name="pricing" onChange={() => { setForm((current) => ({ ...current, pricing: "free" })); setReviewed(false); }} type="radio" value="free" />
                    <span><strong>Free</strong><small>No ticket fee</small></span>
                    {form.pricing === "free" && <Check aria-hidden="true" size={17} />}
                  </label>
                  <label className={`${styles.priceChoice} ${form.pricing === "paid" ? styles.priceChoiceActive : ""}`}>
                    <input checked={form.pricing === "paid"} name="pricing" onChange={() => { setForm((current) => ({ ...current, pricing: "paid" })); setReviewed(false); }} type="radio" value="paid" />
                    <span><strong>Paid</strong><small>Show an entry price</small></span>
                    {form.pricing === "paid" && <Check aria-hidden="true" size={17} />}
                  </label>
                </div>
              </fieldset>
              {form.pricing === "paid" && <label className={`${styles.field} ${styles.priceField}`}>
                <span>Ticket price (₹) <b aria-hidden="true">*</b></span>
                <div className={styles.currencyInput}><span aria-hidden="true">₹</span><input min="1" name="price" onChange={update("price")} placeholder="0.00" required step="0.01" type="number" value={form.price} /></div>
              </label>}
              <p className={styles.pricingNote}>Ticketing and payment processing are not connected in this preview.</p>
            </section>

            <div className={styles.submitArea}>
              <button className={styles.submitButton} type="submit">Review event details <ArrowRight aria-hidden="true" size={18} /></button>
              <p>Your details stay in this page preview and are not sent to a server.</p>
              {reviewed && <div className={styles.successMessage} role="status"><ShieldCheck aria-hidden="true" size={18} /><span>Your event preview is ready. Review the summary before sharing it with attendees.</span></div>}
            </div>
          </form>

          <aside className={styles.sidebar} aria-label="Event listing preview">
            <div id="event-listing-preview" className={styles.previewCard} tabIndex={-1}>
              <div className={styles.previewTopline}><span>LIVE PREVIEW</span><span className={styles.previewDot} /> DRAFT</div>
              <div className={styles.previewArtwork} aria-hidden="true">
                <span className={styles.artRingOne} /><span className={styles.artRingTwo} />
                <Sparkles size={22} />
                <span className={styles.artLabel}>COLLEXUS · CAMPUS EVENTS</span>
              </div>
              <div className={styles.previewContent}>
                <span className={styles.categoryBadge}>{form.category || "EVENT CATEGORY"}</span>
                <h2>{form.eventName || "Your event name"}</h2>
                <p>{form.about || "A short description of your event will appear here."}</p>
                <div className={styles.previewMeta}><CalendarDays aria-hidden="true" size={16} /><span>{dates}</span></div>
                <div className={styles.previewMeta}><Clock3 aria-hidden="true" size={16} /><span>{form.startTime || "Start time"}{form.endTime ? ` – ${form.endTime}` : ""}</span></div>
                <div className={styles.previewMeta}><MapPin aria-hidden="true" size={16} /><span>{form.venue || "Event venue"}</span></div>
                <div className={styles.previewMeta}><Building2 aria-hidden="true" size={16} /><span>{form.institution === "Other institution" ? form.institutionOther || "Your institution" : form.institution || "Institution"}</span></div>
                <div className={styles.previewMeta}><UsersRound aria-hidden="true" size={16} /><span>{form.expectedParticipants ? `Around ${form.expectedParticipants} participants` : "Participant estimate"}</span></div>
                <div className={styles.previewFooter}><span>{form.pricing === "paid" && form.price ? `₹${form.price}` : form.pricing === "paid" ? "Paid entry" : "Free entry"}</span><span>{form.template || "Choose an event layout"}</span></div>
                <div className={styles.previewAudience}>For: {selectedAudience}</div>
              </div>
            </div>
            <div className={styles.checklist}>
              <ShieldCheck aria-hidden="true" size={19} />
              <div><strong>What happens next?</strong><p>This page creates a local preview only. Event publishing and organizer contact are not connected yet.</p></div>
            </div>
            <button className={styles.previewButton} onClick={() => {
              const preview = document.getElementById("event-listing-preview");
              preview?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
              preview?.focus({ preventScroll: true });
            }} type="button" aria-controls="event-listing-preview">
              <Eye aria-hidden="true" size={17} /> Show live preview <ArrowRight aria-hidden="true" size={16} />
            </button>
            <a className={styles.backToEvents} href={`${publicBasePath}/#featured-events`}><ArrowLeft aria-hidden="true" size={16} /> Explore published events</a>
          </aside>
        </div>
        <footer className={styles.footer}>© 2026 Collexus <span>Campus events, in one place.</span></footer>
      </div>
    </main>
  );
}
