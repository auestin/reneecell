import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || 'your-github-username';
const repo = process.env.GITHUB_REPO || 'rene-cell-website';

export async function saveArticle(slug: string, content: string, lang: string) {
  const path = `content/articles/${lang}/${slug}.md`;
  
  try {
    // Check if file exists to get SHA (required for updating)
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      if (!Array.isArray(data)) {
        sha = data.sha;
      }
    } catch (e: any) {
      if (e.status !== 404) throw e;
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `[CMS] Update article: ${slug} (${lang})`,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving article to GitHub:', error);
    return { success: false, error };
  }
}

export async function saveLead(leadData: any) {
  try {
    const title = `New Contact Lead: ${leadData.name || 'Anonymous'}`;
    const body = `
### Contact Details
- **Name**: ${leadData.name}
- **Email**: ${leadData.email}
- **Language**: ${leadData.language}
- **Date**: ${new Date().toISOString()}

### Message
${leadData.message}
    `;

    await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels: ['lead'],
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving lead to GitHub Issues:', error);
    return { success: false, error };
  }
}

export async function getArticles(lang: string) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: `content/articles/${lang}`,
    });
    
    if (Array.isArray(data)) {
      return data.filter(file => file.name.endsWith('.md'));
    }
    return [];
  } catch (error: any) {
    if (error.status === 404) return [];
    console.error('Error fetching articles from GitHub:', error);
    return [];
  }
}
