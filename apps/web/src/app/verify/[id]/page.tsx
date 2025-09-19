/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Certificate } from '@/types';
import { useParams } from 'next/navigation'; // <-- 1. Import useParams

// 2. Remove params from here
export default function VerifyPage() {
  const params = useParams(); // <-- 3. Call the hook here
  const id = params.id as string; // Get the id from the hook

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) { // <-- Use the id from the hook
      const fetchCertificate = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:3001/certificates/public/${id}`);
          if (response.data) {
            setCertificate(response.data);
          } else {
            setError('Certificate not found.');
          }
        } catch (err) {
          setError('Failed to fetch certificate data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCertificate();
    }
  }, [id]); // <-- useEffect depends on id now

  // ... the rest of your component code remains exactly the same

  const renderStatusBadge = (status: Certificate['status']) => {
    const colors = {
      ISSUED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REVOKED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-sm font-medium rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Certificate Verification</CardTitle>
          <CardDescription>This page displays the official status of an academic certificate.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading certificate data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {certificate && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Verification Status:</h3>
                {renderStatusBadge(certificate.status)}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p className="font-medium text-gray-500">Student Name:</p>
                <p>{certificate.studentName}</p>

                <p className="font-medium text-gray-500">Degree Name:</p>
                <p>{certificate.degreeName}</p>

                <p className="font-medium text-gray-500">Certificate ID:</p>
                <p>{certificate.id}</p>

                <p className="font-medium text-gray-500">IPFS CID:</p>
                <p className="truncate">{certificate.ipfsCID || 'Not yet issued'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}