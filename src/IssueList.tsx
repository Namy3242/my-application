import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Issue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  reactions: any[];
  user: {
    login: string;
  };
}

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get<Issue[]>('https://api.github.com/repos/Namy3242/my-app/issues', {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          }
        });
        const issuesWithReactions = await Promise.all(response.data.map(async (issue) => {
          const reactionsResponse = await axios.get(`https://api.github.com/repos/Namy3242/my-app/issues/${issue.number}/reactions`, {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.squirrel-girl-preview+json'
            }
          });
          return { ...issue, reactions: reactionsResponse.data };
        }));
        setIssues(issuesWithReactions);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>GitHub Issues</h1>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              {issue.title}
            </a>
            <div>Reactions: {issue.reactions.length}</div>
            <ul>
              {issue.reactions.map((reaction: any) => (
                <li key={reaction.id}>
                  {reaction.content} by {reaction.user.login}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;