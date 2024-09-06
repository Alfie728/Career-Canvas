import React from "react";
import { Input } from "@/components/ui/input";

type PersonalInfoProps = {
  personalInfo: { name: string; contact: string };
  updatePersonalInfo: (field: string, value: string) => void;
};

export function PersonalInfo({
  personalInfo,
  updatePersonalInfo,
}: PersonalInfoProps) {
  return (
    <div className="text-center flex flex-col items-center gap-2 mb-2">
      <Input
        value={personalInfo.name}
        onChange={(e) => updatePersonalInfo("name", e.target.value)}
        className="text-3xl font-bold text-center border-none"
      />
      <Input
        value={personalInfo.contact}
        onChange={(e) => updatePersonalInfo("contact", e.target.value)}
        className="text-sm text-center border-none"
      />
    </div>
  );
}
