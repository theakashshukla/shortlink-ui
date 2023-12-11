'use client'
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { fetchAuthToken } from '@/utils/auth'; // Adjust the import path

interface Link {
  id: number;
  originalUrl: string;
  shortUrl: string;
  expiresAt: string;
  accessCount: number;
  lastAccessedAt: string;
}

export function AllLinks() {
  const [allLinks, setAllLinks] = useState<Link[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchAuthToken();
        setAuthToken(token);
        fetchLinks(token);
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    };

    fetchData();
  }, []);

  const fetchLinks = async (token: string | null) => {
    try {
      console.log('Auth token before fetchLinks:', token);

      if (!token) {
        console.error('Auth token not available.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get<{ links: Link[] }>('/v1/link/all', { headers });
      setAllLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  return (
    <div>
      <h2>All Links</h2>
      {allLinks.length > 0 ? (
        <ul>
          {allLinks.map((link) => (
            <li key={link.id}>
              <p>Original URL: {link.originalUrl}</p>
              <p>Short URL: {link.shortUrl}</p>
              <p>Access Count: {link.accessCount}</p>
              {/* Add more information as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No links available.</p>
      )}
    </div>
  );
}
