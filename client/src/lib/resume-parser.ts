// Utility to call Affinda Resume Parser API
// https://app.affinda.com/api/

export async function parseResumeFile(file: File, apiKey: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.affinda.com/v2/resumes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to parse resume');
  }

  const data = await response.json();
  return data;
}
