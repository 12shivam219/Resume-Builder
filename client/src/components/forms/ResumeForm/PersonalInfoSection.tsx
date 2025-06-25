import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, User } from "lucide-react";
import { ResumeData } from "@shared/schema";

interface PersonalInfoSectionProps {
  personalInfo: ResumeData["personalInfo"];
  expanded: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (data: ResumeData["personalInfo"]) => void;
  onGenerateSummary: () => void;
  analyzeResult: { missingKeywords: string[]; suggestions: string } | null;
  highlightKeywords: (text: string, keywords: string[]) => React.ReactNode;
}

export const PersonalInfoSection = React.memo<PersonalInfoSectionProps>(
  function PersonalInfoSection({
    personalInfo,
    expanded,
    onToggle,
    onMoveUp,
    onMoveDown,
    onUpdate,
    onGenerateSummary,
    analyzeResult,
    highlightKeywords,
  }) {
    // Advanced validation: required fields
    const errors = useMemo(() => {
      const errs: Record<string, string> = {};
      if (!personalInfo.firstName?.trim())
        errs.firstName = "First name is required.";
      if (!personalInfo.lastName?.trim())
        errs.lastName = "Last name is required.";
      if (!personalInfo.email?.trim()) errs.email = "Email is required.";
      if (!personalInfo.phone?.trim()) errs.phone = "Phone is required.";
      return errs;
    }, [personalInfo]);

    return (
      <Card key="personalInfo" className="mb-4 shadow rounded-lg">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between mb-2">
            <h3 className="section-title flex items-center text-lg font-semibold">
              <User className="section-icon mr-2" /> Personal Information
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                aria-label="Move section up"
              >
                <ChevronUp />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                aria-label="Move section down"
              >
                <ChevronDown />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                aria-label="Toggle section"
              >
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
          </div>
          {expanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, firstName: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  placeholder="First Name"
                  className="mb-2"
                />
                {errors.firstName && (
                  <span id="firstName-error" className="text-red-600 text-xs">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, lastName: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                  placeholder="Last Name"
                  className="mb-2"
                />
                {errors.lastName && (
                  <span id="lastName-error" className="text-red-600 text-xs">
                    {errors.lastName}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, email: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder="Email"
                  className="mb-2"
                />
                {errors.email && (
                  <span id="email-error" className="text-red-600 text-xs">
                    {errors.email}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, phone: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  placeholder="Phone"
                  className="mb-2"
                />
                {errors.phone && (
                  <span id="phone-error" className="text-red-600 text-xs">
                    {errors.phone}
                  </span>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={personalInfo.title || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, title: e.target.value })
                  }
                  placeholder="Senior Software Engineer"
                  className="mb-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={personalInfo.address || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, address: e.target.value })
                  }
                  placeholder="123 Main St, City, State 12345"
                  className="mb-2"
                  autoComplete="street-address"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={personalInfo.linkedin || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/johndoe"
                  className="mb-2"
                  autoComplete="url"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={personalInfo.summary || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, summary: e.target.value })
                  }
                  placeholder="Brief overview of your professional background and key achievements..."
                  className="mb-2"
                  aria-multiline="true"
                />
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  onClick={onGenerateSummary}
                >
                  Generate Summary
                </Button>
                {analyzeResult && analyzeResult.missingKeywords.length > 0 && (
                  <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                    <b>Missing keywords in summary:</b>
                    <div>
                      {highlightKeywords(
                        personalInfo.summary || "",
                        analyzeResult.missingKeywords
                      )}
                    </div>
                    <div className="mt-1">{analyzeResult.suggestions}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
