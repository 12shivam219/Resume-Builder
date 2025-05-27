import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { ResumeData, Resume } from '@shared/schema';
import { resumeDataSchema } from '@shared/schema';

const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    address: '',
    linkedin: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skillCategories: [],
};

export function useResume(resumeId?: number) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch existing resume if ID is provided
  const { data: resume, isLoading } = useQuery({
    queryKey: ['/api/resumes', resumeId],
    enabled: !!resumeId,
  });

  // Load resume data when fetched
  useEffect(() => {
    if (resume) {
      setResumeData(resume.data);
      setSelectedTemplate(resume.template);
    }
  }, [resume]);

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      let completedSections = 0;
      const totalSections = 4;

      // Personal info section (25%)
      if (
        resumeData.personalInfo.firstName &&
        resumeData.personalInfo.lastName &&
        resumeData.personalInfo.email &&
        resumeData.personalInfo.phone
      ) {
        completedSections += 1;
      }

      // Work experience section (25%)
      if (resumeData.workExperience.length > 0) {
        const hasValidExperience = resumeData.workExperience.some(
          exp => exp.title && exp.company && exp.startDate
        );
        if (hasValidExperience) {
          completedSections += 1;
        }
      }

      // Education section (25%)
      if (resumeData.education.length > 0) {
        const hasValidEducation = resumeData.education.some(
          edu => edu.degree && edu.field && edu.institution
        );
        if (hasValidEducation) {
          completedSections += 1;
        }
      }

      // Skills section (25%)
      if (resumeData.skillCategories.length > 0) {
        const hasValidSkills = resumeData.skillCategories.some(
          cat => cat.name && cat.skills.length > 0
        );
        if (hasValidSkills) {
          completedSections += 1;
        }
      }

      return Math.round((completedSections / totalSections) * 100);
    };

    setProgress(calculateProgress());
  }, [resumeData]);

  // Save resume mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        userId: 'anonymous',
        title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`.trim() || 'Untitled Resume',
        data: resumeData,
        template: selectedTemplate,
      };

      if (resumeId) {
        return await apiRequest('PUT', `/api/resumes/${resumeId}`, payload);
      } else {
        return await apiRequest('POST', '/api/resumes', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      toast({
        title: 'Resume Saved',
        description: 'Your resume has been saved successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your resume',
        variant: 'destructive',
      });
    },
  });

  // Update resume data with validation
  const updateResumeData = useCallback((updates: Partial<ResumeData>) => {
    setResumeData(prev => {
      const updated = { ...prev, ...updates };
      
      try {
        // Validate the updated data
        resumeDataSchema.parse(updated);
        return updated;
      } catch (error) {
        console.warn('Invalid resume data:', error);
        return updated; // Still update but log the warning
      }
    });
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName) {
      return; // Don't auto-save empty resumes
    }

    const autoSaveTimeout = setTimeout(() => {
      if (progress > 0) {
        saveMutation.mutate();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [resumeData, selectedTemplate, progress]);

  return {
    resumeData,
    updateResumeData,
    selectedTemplate,
    setSelectedTemplate,
    progress,
    saveResume: () => saveMutation.mutate(),
    isSaving: saveMutation.isPending,
    isLoading,
  };
}
