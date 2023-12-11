"use client";
import { useState, useEffect } from "react";
import api from "../utils/api";

interface Link {
  id: number;
  originalUrl: string;
  shortUrl: string;
  expiresAt: string;
  accessCount: number;
  lastAccessedAt: string;
}

export function CreateLink() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [alllinks, setAllLinks] = useState<Link[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is logged in
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken); // Set the authToken state

    setLoggedIn(!!authToken);

    if (authToken) {
      // If logged in, fetch and display the user's links
      fetchUserLinks();
    }
  }, []);

  const fetchUserLinks = async () => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const response = await api.get<{ links: Link[] }>("/v1/link/all", {
        headers,
      });
      setAllLinks(response.data.links);
    } catch (error) {
      console.error("Error fetching user links:", error);
    }
  };

  const handleCreateLink = async () => {
    try {
        if (!loggedIn) {
            console.error('User not logged in.');
            return;
          }
          const response = await api.post<{ link: Link }>(
            "/v1/link/create",
            { originalUrl },
            {
              headers: {
                Authorization: `Bearer ${authToken}`, // Use authToken state
              },
            }
          );
      setShortUrl(response.data.link.shortUrl);

      // Fetch and display the updated user's links
      fetchUserLinks();
    } catch (error) {
      console.error("Create link error:", error);
    }
  };

  const handleVisitLink = async (linkId: number) => {
    try {
      const response = await api.get(`/v1/link/${linkId}`);
      console.log("Link analytics:", response.data);
    } catch (error) {
      console.error("Visit link error:", error);
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <p>Please log in to create and view your links.</p>
      ) : (
        <>
          <h2>Create a Link</h2>
          <input
            type="url"
            placeholder="Enter your URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <button onClick={handleCreateLink}>Create Link</button>

          {shortUrl && (
            <div>
              <p>Your short URL:</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </div>
          )}

          {alllinks.length > 0 && (
            <>
              <h2>Your Links</h2>
              <ul>
                {alllinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleVisitLink(link.id)}
                    >
                      {link.shortUrl}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
