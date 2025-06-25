import type { ResumeData } from "@shared/schema";

interface TemplateProps {
  resumeData: ResumeData;
  zoomLevel: number;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const formatDateRange = (
  startDate: string,
  endDate: string,
  current: boolean
) => {
  const start = formatDate(startDate);
  const end = current ? "Present" : formatDate(endDate);
  return `${start} - ${end}`;
};

export function ModernTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  return (
    <div
      className="resume-preview bg-white shadow-lg"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
      }}
    >
      <div className="p-8">
        {/* Header Section */}
        <div className="text-center border-b-2 border-primary pb-6 mb-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-xl text-gray-600 mb-4">{personalInfo.title}</p>
          )}

          <div className="flex flex-wrap justify-center items-center space-x-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.email || personalInfo.phone) &&
              personalInfo.address && <span>•</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {(personalInfo.email ||
              personalInfo.phone ||
              personalInfo.address) &&
              personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary border-b border-gray-300 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary border-b border-gray-300 pb-1 mb-3">
              WORK EXPERIENCE
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-secondary">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700 ml-4">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary border-b border-gray-300 pb-1 mb-3">
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-secondary">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {(edu.startYear || edu.endYear) && (
                      <p>
                        {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                        {edu.endYear}
                      </p>
                    )}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary border-b border-gray-300 pb-1 mb-3">
              TECHNICAL SKILLS
            </h2>
            {skillCategories.map((category) => (
              <div key={category.id} className="mb-3">
                <div className="flex items-start">
                  <h4 className="font-medium text-secondary w-32 flex-shrink-0">
                    {category.name}:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {category.skills.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClassicTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  return (
    <div
      className="resume-preview bg-white shadow-lg"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
      }}
    >
      <div className="p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-lg text-gray-700 mb-4 italic">
              {personalInfo.title}
            </p>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">
              SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-center italic">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">
              PROFESSIONAL EXPERIENCE
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4 text-center">
                <h3 className="font-bold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-600">
                  {(edu.startYear || edu.endYear) && (
                    <>
                      {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                      {edu.endYear}
                    </>
                  )}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">
              SKILLS
            </h2>
            {skillCategories.map((category) => (
              <div key={category.id} className="mb-3 text-center">
                <h4 className="font-bold text-gray-900">{category.name}</h4>
                <p className="text-gray-700 text-sm">
                  {category.skills.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CreativeTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  return (
    <div
      className="resume-preview bg-white shadow-lg"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
      }}
    >
      <div className="grid grid-cols-3 h-full">
        {/* Left Sidebar */}
        <div className="col-span-1 bg-gray-800 text-white p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {fullName || "Your Name"}
            </h1>
            {personalInfo.title && (
              <p className="text-accent text-lg">{personalInfo.title}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-accent font-bold mb-4 uppercase tracking-wide">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.address && <div>{personalInfo.address}</div>}
              {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
            </div>
          </div>

          {/* Skills */}
          {skillCategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-accent font-bold mb-4 uppercase tracking-wide">
                Skills
              </h2>
              {skillCategories.map((category) => (
                <div key={category.id} className="mb-4">
                  <h4 className="font-bold text-sm mb-2">{category.name}</h4>
                  <div className="space-y-1">
                    {category.skills.map((skill, index) => (
                      <div key={index} className="text-xs">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="col-span-2 p-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-accent pb-2">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-accent pb-2">
                Experience
              </h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {exp.title}
                    </h3>
                    <p className="text-accent font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-600">
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700">
                      {exp.description.split("\n").map((line, index) => (
                        <p key={index} className="mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-accent pb-2">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-accent font-semibold">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {(edu.startYear || edu.endYear) && (
                      <>
                        {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                        {edu.endYear}
                      </>
                    )}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skillCategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-accent pb-2">
                Skills
              </h2>
              {skillCategories.map((category) => (
                <div key={category.id} className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-gray-700 font-light">
                    {category.skills.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MinimalTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  return (
    <div
      className="resume-preview bg-white shadow-lg"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
      }}
    >
      <div className="p-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-xl text-gray-600 mb-6 font-light">
              {personalInfo.title}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-light">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
              Experience
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-8">
                <div className="mb-3">
                  <h3 className="text-xl font-medium text-gray-900">
                    {exp.title}
                  </h3>
                  <p className="text-gray-700 font-light">{exp.company}</p>
                  <p className="text-sm text-gray-500 font-light">
                    {formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                {exp.description && (
                  <div className="text-gray-700 font-light leading-relaxed">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700 font-light">{edu.institution}</p>
                <p className="text-sm text-gray-500 font-light">
                  {(edu.startYear || edu.endYear) && (
                    <>
                      {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                      {edu.endYear}
                    </>
                  )}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
              Skills
            </h2>
            {skillCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-700 font-light">
                  {category.skills.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Elegant Template
export function ElegantTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  return (
    <div
      className="resume-preview bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-xl"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
        fontFamily: "Georgia, serif",
        color: "#222",
      }}
    >
      <div className="p-10">
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 mb-2">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-lg text-gray-500 mb-2">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap justify-center items-center space-x-4 text-sm text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.email || personalInfo.phone) &&
              personalInfo.address && <span>•</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {(personalInfo.email ||
              personalInfo.phone ||
              personalInfo.address) &&
              personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-700 border-b border-gray-200 pb-1 mb-3">
              Profile
            </h2>
            <p className="text-gray-700 leading-relaxed italic">
              {personalInfo.summary}
            </p>
          </div>
        )}
        {workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-700 border-b border-gray-200 pb-1 mb-3">
              Experience
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-800">{exp.title}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}
                  </span>
                </div>
                <p className="text-pink-600 font-semibold">{exp.company}</p>
                {exp.location && (
                  <p className="text-xs text-gray-500">{exp.location}</p>
                )}
                {exp.description && (
                  <div className="text-sm text-gray-700 mt-1">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-700 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-pink-600">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-blue-700">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {(edu.startYear || edu.endYear) && (
                    <>
                      {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                      {edu.endYear}
                    </>
                  )}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-pink-600 border-b border-gray-200 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center">
                  <span className="font-semibold text-blue-700 mb-1">
                    {cat.name}
                  </span>
                  <div className="flex gap-1">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ATS-Friendly Template
export function ATSFriendlyTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  return (
    <div
      className="resume-preview bg-white border border-gray-300"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#222",
      }}
    >
      <div className="p-8">
        <div className="text-left border-b border-gray-400 pb-3 mb-4">
          <h1 className="text-2xl font-bold text-black mb-1">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-base text-gray-700 mb-1">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-gray-700">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-1 mb-2">
              Summary
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}
        {workExperience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-1 mb-2">
              Work Experience
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-black text-sm">
                      {exp.title}
                    </h3>
                    <p className="text-gray-700 text-xs">{exp.company}</p>
                  </div>
                  <div className="text-right text-xs text-gray-700">
                    <p>
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-xs text-gray-800 ml-2">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-1 mb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black text-sm">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700 text-xs">{edu.institution}</p>
                  </div>
                  <div className="text-right text-xs text-gray-700">
                    {(edu.startYear || edu.endYear) && (
                      <p>
                        {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                        {edu.endYear}
                      </p>
                    )}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {skillCategories.length > 0 && (
          <div className="mb-2">
            <h2 className="text-base font-semibold text-black border-b border-gray-200 pb-1 mb-2">
              Skills
            </h2>
            <ul className="flex flex-wrap gap-2">
              {skillCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="bg-gray-100 text-black px-2 py-0.5 rounded text-xs font-medium"
                >
                  {cat.name}: {cat.skills.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Infographic Template
export function InfographicTemplate({ resumeData, zoomLevel }: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  return (
    <div
      className="resume-preview bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-200 rounded-2xl shadow-2xl"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
        fontFamily: "Montserrat, Arial, sans-serif",
        color: "#222",
      }}
    >
      <div className="p-10">
        <div className="flex items-center mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-1">
              {fullName || "Your Name"}
            </h1>
            {personalInfo.title && (
              <p className="text-lg text-pink-600 mb-2">{personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Profile</h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}
        {workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-pink-600 mb-2">
              Experience Timeline
            </h2>
            <div className="relative border-l-4 border-blue-200 pl-6">
              {workExperience.map((exp, idx) => (
                <div key={exp.id} className="mb-8 relative">
                  <div className="absolute -left-8 top-1.5 w-5 h-5 bg-pink-400 rounded-full border-4 border-white"></div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-blue-700">{exp.title}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}
                    </span>
                  </div>
                  <p className="text-pink-600 font-semibold">{exp.company}</p>
                  {exp.location && (
                    <p className="text-xs text-gray-500">{exp.location}</p>
                  )}
                  {exp.description && (
                    <div className="text-sm text-gray-700 mt-1">
                      {exp.description.split("\n").map((line, index) => (
                        <p key={index} className="mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-pink-600">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-blue-700">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {(edu.startYear || edu.endYear) && (
                    <>
                      {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                      {edu.endYear}
                    </>
                  )}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}
        {skillCategories.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-pink-600 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center">
                  <span className="font-semibold text-blue-700 mb-1">
                    {cat.name}
                  </span>
                  <div className="flex gap-1">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Black & White Minimal Template
export function BlackWhiteMinimalTemplate({
  resumeData,
  zoomLevel,
}: TemplateProps) {
  const { personalInfo, workExperience, education, skillCategories } =
    resumeData;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  return (
    <div
      className="resume-preview bg-white border border-black"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        width: "8.5in",
        minHeight: "11in",
        fontFamily: "Helvetica Neue, Arial, sans-serif",
        color: "#111",
      }}
    >
      <div className="p-10">
        <div className="mb-8 border-b border-black pb-4">
          <h1 className="text-4xl font-bold text-black mb-2">
            {fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-lg text-black mb-2">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-black">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-2">Summary</h2>
            <p className="text-black leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}
        {workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-2">Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-black">{exp.title}</h3>
                    <p className="text-black">{exp.company}</p>
                  </div>
                  <div className="text-right text-xs text-black">
                    <p>
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm text-black ml-4">
                    {exp.description.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-black">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-black">{edu.institution}</p>
                <p className="text-xs text-black">
                  {(edu.startYear || edu.endYear) && (
                    <>
                      {edu.startYear} {edu.startYear && edu.endYear && "- "}{" "}
                      {edu.endYear}
                    </>
                  )}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}
        {skillCategories.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-black mb-2">Skills</h2>
            <ul className="flex flex-wrap gap-2">
              {skillCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="bg-white border border-black px-3 py-1 rounded text-sm font-medium"
                >
                  {cat.name}: {cat.skills.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
