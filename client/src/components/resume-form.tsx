import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";
import type { ResumeData, WorkExperience, Education, SkillCategory } from "@shared/schema";
import { 
  personalInfoSchema, 
  workExperienceSchema, 
  educationSchema, 
  skillCategorySchema 
} from "@shared/schema";

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdateData: (data: Partial<ResumeData>) => void;
}

export default function ResumeForm({ resumeData, onUpdateData }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: true,
    education: true,
    skills: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Personal Information Form
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: resumeData.personalInfo,
  });

  const handlePersonalInfoUpdate = (data: any) => {
    onUpdateData({ personalInfo: data });
  };

  // Work Experience Functions
  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: generateId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    
    onUpdateData({
      workExperience: [...resumeData.workExperience, newExperience]
    });
  };

  const updateWorkExperience = (id: string, data: Partial<WorkExperience>) => {
    const updated = resumeData.workExperience.map(exp =>
      exp.id === id ? { ...exp, ...data } : exp
    );
    onUpdateData({ workExperience: updated });
  };

  const removeWorkExperience = (id: string) => {
    const filtered = resumeData.workExperience.filter(exp => exp.id !== id);
    onUpdateData({ workExperience: filtered });
  };

  const moveWorkExperience = (id: string, direction: 'up' | 'down') => {
    const index = resumeData.workExperience.findIndex(exp => exp.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resumeData.workExperience.length) return;
    
    const updated = [...resumeData.workExperience];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onUpdateData({ workExperience: updated });
  };

  // Education Functions
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: "",
      field: "",
      institution: "",
      location: "",
      startYear: undefined,
      endYear: undefined,
      gpa: undefined,
    };
    
    onUpdateData({
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    const updated = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, ...data } : edu
    );
    onUpdateData({ education: updated });
  };

  const removeEducation = (id: string) => {
    const filtered = resumeData.education.filter(edu => edu.id !== id);
    onUpdateData({ education: filtered });
  };

  // Skills Functions
  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: generateId(),
      name: "",
      skills: [],
    };
    
    onUpdateData({
      skillCategories: [...resumeData.skillCategories, newCategory]
    });
  };

  const updateSkillCategory = (id: string, data: Partial<SkillCategory>) => {
    const updated = resumeData.skillCategories.map(cat =>
      cat.id === id ? { ...cat, ...data } : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  const removeSkillCategory = (id: string) => {
    const filtered = resumeData.skillCategories.filter(cat => cat.id !== id);
    onUpdateData({ skillCategories: filtered });
  };

  const addSkill = (categoryId: string, skill: string) => {
    if (!skill.trim()) return;
    
    const updated = resumeData.skillCategories.map(cat =>
      cat.id === categoryId 
        ? { ...cat, skills: [...cat.skills, skill.trim()] }
        : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const updated = resumeData.skillCategories.map(cat =>
      cat.id === categoryId 
        ? { ...cat, skills: cat.skills.filter((_, index) => index !== skillIndex) }
        : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card>
        <CardContent className="p-6">
          <div className="section-header">
            <h3 className="section-title">
              <User className="section-icon" />
              Personal Information
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('personal')}
            >
              {expandedSections.personal ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>

          {expandedSections.personal && (
            <form className="form-grid">
              <div className="form-field">
                <Label className="form-label">First Name *</Label>
                <Input
                  className="form-input"
                  placeholder="John"
                  value={resumeData.personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    firstName: e.target.value
                  })}
                />
              </div>

              <div className="form-field">
                <Label className="form-label">Last Name *</Label>
                <Input
                  className="form-input"
                  placeholder="Doe"
                  value={resumeData.personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    lastName: e.target.value
                  })}
                />
              </div>

              <div className="form-field md:col-span-2">
                <Label className="form-label">Professional Title</Label>
                <Input
                  className="form-input"
                  placeholder="Senior Software Engineer"
                  value={resumeData.personalInfo.title || ""}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    title: e.target.value
                  })}
                />
              </div>

              <div className="form-field">
                <Label className="form-label">Email *</Label>
                <Input
                  type="email"
                  className="form-input"
                  placeholder="john.doe@email.com"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    email: e.target.value
                  })}
                />
              </div>

              <div className="form-field">
                <Label className="form-label">Phone *</Label>
                <Input
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    phone: e.target.value
                  })}
                />
              </div>

              <div className="form-field md:col-span-2">
                <Label className="form-label">Address</Label>
                <Input
                  className="form-input"
                  placeholder="123 Main St, City, State 12345"
                  value={resumeData.personalInfo.address || ""}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    address: e.target.value
                  })}
                />
              </div>

              <div className="form-field md:col-span-2">
                <Label className="form-label">LinkedIn URL</Label>
                <Input
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={resumeData.personalInfo.linkedin || ""}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    linkedin: e.target.value
                  })}
                />
              </div>

              <div className="form-field md:col-span-2">
                <Label className="form-label">Professional Summary</Label>
                <Textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Brief overview of your professional background and key achievements..."
                  value={resumeData.personalInfo.summary || ""}
                  onChange={(e) => handlePersonalInfoUpdate({
                    ...resumeData.personalInfo,
                    summary: e.target.value
                  })}
                />
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Work Experience Section */}
      <Card>
        <CardContent className="p-6">
          <div className="section-header">
            <h3 className="section-title">
              <Briefcase className="section-icon" />
              Work Experience
            </h3>
            <Button
              onClick={addWorkExperience}
              className="btn-primary"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>

          {expandedSections.experience && (
            <div className="space-y-4">
              {resumeData.workExperience.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Experience #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveWorkExperience(exp.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveWorkExperience(exp.id, 'down')}
                        disabled={index === resumeData.workExperience.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-destructive hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <Label className="form-label">Job Title *</Label>
                      <Input
                        className="form-input"
                        placeholder="Senior Software Engineer"
                        value={exp.title}
                        onChange={(e) => updateWorkExperience(exp.id, { title: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">Company *</Label>
                      <Input
                        className="form-input"
                        placeholder="Tech Solutions Inc."
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">Start Date *</Label>
                      <Input
                        type="month"
                        className="form-input"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">End Date</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="month"
                          className="form-input flex-1"
                          value={exp.endDate}
                          onChange={(e) => updateWorkExperience(exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={exp.current}
                            onCheckedChange={(checked) => 
                              updateWorkExperience(exp.id, { 
                                current: checked as boolean,
                                endDate: checked ? "" : exp.endDate
                              })
                            }
                          />
                          <Label className="text-sm text-gray-600">Current</Label>
                        </div>
                      </div>
                    </div>

                    <div className="form-field md:col-span-2">
                      <Label className="form-label">Location</Label>
                      <Input
                        className="form-input"
                        placeholder="San Francisco, CA"
                        value={exp.location}
                        onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                      />
                    </div>

                    <div className="form-field md:col-span-2">
                      <Label className="form-label">Description</Label>
                      <Textarea
                        rows={4}
                        className="form-textarea"
                        placeholder="• Led development of microservices architecture reducing response time by 40%&#10;• Managed team of 5 developers and mentored junior engineers&#10;• Implemented CI/CD pipelines improving deployment efficiency"
                        value={exp.description}
                        onChange={(e) => updateWorkExperience(exp.id, { description: e.target.value })}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use bullet points (•) to highlight key achievements
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {resumeData.workExperience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No work experience added yet</p>
                  <Button
                    onClick={addWorkExperience}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardContent className="p-6">
          <div className="section-header">
            <h3 className="section-title">
              <GraduationCap className="section-icon" />
              Education
            </h3>
            <Button
              onClick={addEducation}
              className="btn-primary"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>

          {expandedSections.education && (
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Education #{index + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-destructive hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <Label className="form-label">Degree *</Label>
                      <Input
                        className="form-input"
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">Field of Study *</Label>
                      <Input
                        className="form-input"
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      />
                    </div>

                    <div className="form-field md:col-span-2">
                      <Label className="form-label">Institution *</Label>
                      <Input
                        className="form-input"
                        placeholder="University of California, Berkeley"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">Start Year</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="2016"
                        min="1950"
                        max="2030"
                        value={edu.startYear || ""}
                        onChange={(e) => updateEducation(edu.id, { 
                          startYear: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">End Year</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="2020"
                        min="1950"
                        max="2030"
                        value={edu.endYear || ""}
                        onChange={(e) => updateEducation(edu.id, { 
                          endYear: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">GPA (Optional)</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="3.8"
                        step="0.1"
                        min="0"
                        max="4"
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(edu.id, { 
                          gpa: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div className="form-field">
                      <Label className="form-label">Location</Label>
                      <Input
                        className="form-input"
                        placeholder="Berkeley, CA"
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {resumeData.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No education added yet</p>
                  <Button
                    onClick={addEducation}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Education
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardContent className="p-6">
          <div className="section-header">
            <h3 className="section-title">
              <Settings className="section-icon" />
              Skills & Technologies
            </h3>
            <Button
              onClick={addSkillCategory}
              className="btn-primary"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          {expandedSections.skills && (
            <div className="space-y-6">
              {resumeData.skillCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-3">
                    <Input
                      className="text-sm font-medium bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 p-0"
                      placeholder="Programming Languages"
                      value={category.name}
                      onChange={(e) => updateSkillCategory(category.id, { name: e.target.value })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkillCategory(category.id)}
                      className="text-destructive hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 p-0 h-auto text-primary hover:text-blue-700"
                          onClick={() => removeSkill(category.id, skillIndex)}
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      className="flex-1 text-sm"
                      placeholder="Add a skill..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          addSkill(category.id, input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          addSkill(category.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}

              {resumeData.skillCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No skills added yet</p>
                  <Button
                    onClick={addSkillCategory}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Skill Category
                  </Button>
                </div>
              )}

              {resumeData.skillCategories.length > 0 && (
                <div className="text-center py-4 border-t border-gray-200">
                  <Button
                    onClick={addSkillCategory}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill Category
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
