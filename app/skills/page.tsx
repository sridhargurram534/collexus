import type { Metadata } from "next";
import { SkillsExperience } from "./skills-experience";

export const metadata: Metadata = {
  title: "Skills & interests",
  description: "Share your skills, branch, experience and interests with the Collexus community.",
};

export default function SkillsPage() {
  return <SkillsExperience />;
}
