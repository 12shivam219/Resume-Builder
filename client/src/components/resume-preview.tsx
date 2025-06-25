import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  ChevronDown,
  FileText,
} from "lucide-react";
import type { ResumeData } from "@shared/schema";
import {
  ModernTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalTemplate,
  ElegantTemplate,
  ATSFriendlyTemplate,
  InfographicTemplate,
  BlackWhiteMinimalTemplate,
} from "@/lib/resume-templates";
import { useState } from "react";

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onSave: () => void;
  onDownloadPDF: () => void;
  onDownloadWord: () => void;
  isSaving?: boolean;
}

export default function ResumePreview({
  resumeData,
  selectedTemplate,
  onTemplateChange,
  onSave,
  onDownloadPDF,
  onDownloadWord,
  isSaving = false,
}: ResumePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(60);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 100));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 30));
  };

  const renderTemplate = () => {
    const props = { resumeData, zoomLevel };

    switch (selectedTemplate) {
      case "classic":
        return <ClassicTemplate {...props} />;
      case "creative":
        return <CreativeTemplate {...props} />;
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "elegant":
        return <ElegantTemplate {...props} />;
      case "ats":
        return <ATSFriendlyTemplate {...props} />;
      case "infographic":
        return <InfographicTemplate {...props} />;
      case "bwminimal":
        return <BlackWhiteMinimalTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Preview Header */}
      <CardContent className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 30}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-500 min-w-[3rem]">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 100}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern Template</SelectItem>
                <SelectItem value="classic">Classic Template</SelectItem>
                <SelectItem value="creative">Creative Template</SelectItem>
                <SelectItem value="minimal">Minimal Template</SelectItem>
                <SelectItem value="elegant">Elegant Template</SelectItem>
                <SelectItem value="ats">ATS-Friendly Template</SelectItem>
                <SelectItem value="infographic">
                  Infographic Template
                </SelectItem>
                <SelectItem value="bwminimal">Black & White Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="btn-secondary"
            >
              <Save className="mr-1 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="btn-accent">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDownloadPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownloadWord}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>

      {/* Resume Preview */}
      <CardContent className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="flex justify-center">{renderTemplate()}</div>
      </CardContent>
    </Card>
  );
}
