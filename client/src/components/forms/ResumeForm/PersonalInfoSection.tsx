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
      <Card key="personalInfo">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="section-title flex items-center">
              <User className="section-icon" /> Personal Information
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
            <form className="form-grid" autoComplete="on">
              <div className="form-field">
                <Label className="form-label" htmlFor="firstName">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  className="form-input"
                  placeholder="John"
                  value={personalInfo.firstName}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, firstName: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                />
                {errors.firstName && (
                  <span id="firstName-error" className="text-red-600 text-xs">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="form-field">
                <Label className="form-label" htmlFor="lastName">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  className="form-input"
                  placeholder="Doe"
                  value={personalInfo.lastName}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, lastName: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                />
                {errors.lastName && (
                  <span id="lastName-error" className="text-red-600 text-xs">
                    {errors.lastName}
                  </span>
                )}
              </div>
              <div className="form-field md:col-span-2">
                <Label className="form-label" htmlFor="title">
                  Professional Title
                </Label>
                <Input
                  id="title"
                  className="form-input"
                  placeholder="Senior Software Engineer"
                  value={personalInfo.title || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, title: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label className="form-label" htmlFor="email">
                  Email *
                </Label>
                <Input
                  id="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={personalInfo.email}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, email: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  type="email"
                  autoComplete="email"
                />
                {errors.email && (
                  <span id="email-error" className="text-red-600 text-xs">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="form-field">
                <Label className="form-label" htmlFor="phone">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  className="form-input"
                  placeholder="(123) 456-7890"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, phone: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  type="tel"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <span id="phone-error" className="text-red-600 text-xs">
                    {errors.phone}
                  </span>
                )}
              </div>
              <div className="form-field md:col-span-2">
                <Label className="form-label" htmlFor="address">
                  Address
                </Label>
                <Input
                  id="address"
                  className="form-input"
                  placeholder="123 Main St, City, State 12345"
                  value={personalInfo.address || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, address: e.target.value })
                  }
                  autoComplete="street-address"
                />
              </div>
              <div className="form-field md:col-span-2">
                <Label className="form-label" htmlFor="linkedin">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={personalInfo.linkedin || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, linkedin: e.target.value })
                  }
                  autoComplete="url"
                />
              </div>
              <div className="form-field md:col-span-2">
                <Label className="form-label" htmlFor="summary">
                  Professional Summary
                </Label>
                <Textarea
                  id="summary"
                  rows={4}
                  className="form-textarea"
                  placeholder="Brief overview of your professional background and key achievements..."
                  value={personalInfo.summary || ""}
                  onChange={(e) =>
                    onUpdate({ ...personalInfo, summary: e.target.value })
                  }
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
            </form>
          )}
        </CardContent>
      </Card>
    );
  }
);
