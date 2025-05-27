import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ResumeForm from "@/components/resume-form";
import ResumePreview from "@/components/resume-preview";
import { useResume } from "@/hooks/use-resume";
import { PDFGenerator } from "@/components/pdf-generator";
import { WordGenerator } from "@/components/word-generator";
import { Menu } from "lucide-react";

export default function ResumeBuilder() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const {
    resumeData,
    updateResumeData,
    selectedTemplate,
    setSelectedTemplate,
    saveResume,
    isSaving,
    progress,
  } = useResume(id ? parseInt(id) : undefined);

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Your resume is being prepared for download",
      });
      
      const pdfGenerator = new PDFGenerator();
      await pdfGenerator.generatePDF(resumeData, selectedTemplate);
      
      toast({
        title: "Download Complete",
        description: "Your resume PDF has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    try {
      toast({
        title: "Generating Word Document...",
        description: "Your resume is being prepared for download",
      });
      
      const wordGenerator = new WordGenerator();
      await wordGenerator.generateWord(resumeData, selectedTemplate);
      
      toast({
        title: "Download Complete",
        description: "Your resume Word document has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your Word document",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      await saveResume();
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ResumeBuilder Pro</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Templates
                </a>
                <a href="#" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Examples
                </a>
                <a href="#" className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Help
                </a>
                <Button size="sm" className="btn-primary">
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-secondary">Resume Progress</h2>
                  <span className="text-sm text-gray-600">{progress}% Complete</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className={`progress-indicator ${progress >= 25 ? 'bg-success' : 'bg-gray-300'}`}>
                      {progress >= 25 ? '✓' : '1'}
                    </div>
                    <span className={progress >= 25 ? 'text-gray-600' : 'text-gray-400'}>Personal</span>
                  </div>
                  <div className="text-center">
                    <div className={`progress-indicator ${progress >= 50 ? 'bg-success' : progress >= 25 ? 'bg-primary' : 'bg-gray-300'}`}>
                      {progress >= 50 ? '✓' : '2'}
                    </div>
                    <span className={progress >= 50 ? 'text-gray-600' : progress >= 25 ? 'text-primary font-medium' : 'text-gray-400'}>Experience</span>
                  </div>
                  <div className="text-center">
                    <div className={`progress-indicator ${progress >= 75 ? 'bg-success' : progress >= 50 ? 'bg-primary' : 'bg-gray-300'}`}>
                      {progress >= 75 ? '✓' : '3'}
                    </div>
                    <span className={progress >= 75 ? 'text-gray-600' : progress >= 50 ? 'text-primary font-medium' : 'text-gray-400'}>Education</span>
                  </div>
                  <div className="text-center">
                    <div className={`progress-indicator ${progress >= 100 ? 'bg-success' : progress >= 75 ? 'bg-primary' : 'bg-gray-300'}`}>
                      {progress >= 100 ? '✓' : '4'}
                    </div>
                    <span className={progress >= 100 ? 'text-gray-600' : progress >= 75 ? 'text-primary font-medium' : 'text-gray-400'}>Skills</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Form */}
            <ResumeForm
              resumeData={resumeData}
              onUpdateData={updateResumeData}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 lg:h-screen lg:overflow-hidden">
            <ResumePreview
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              onSave={handleSave}
              onDownloadPDF={handleDownloadPDF}
              onDownloadWord={handleDownloadWord}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        <Button
          size="icon"
          className="floating-action bg-success hover:bg-green-600"
          onClick={handleSave}
          disabled={isSaving}
          title="Save Resume"
        >
          {isSaving ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            '✓'
          )}
        </Button>
        
        <Button
          size="icon"
          className="floating-action bg-accent hover:bg-orange-600"
          onClick={handleDownloadPDF}
          title="Download PDF"
        >
          ↓
        </Button>
      </div>
    </div>
  );
}
