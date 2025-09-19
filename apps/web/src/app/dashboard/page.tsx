'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { QRCodeSVG } from 'qrcode.react';
import { IssueCertificateForm } from '@/components/IssueCertificateForm';
import type { Certificate } from '@/types'; // <-- Import the shared type

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.token) {
      const fetchCertificates = async () => {
        try {
          const response = await axios.get('http://localhost:3001/certificates', {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          setCertificates(response.data);
        } catch { // <-- Cleaned up unused 'error' variable
          toast.error('Failed to fetch certificates.');
        }
      };
      fetchCertificates();
    }
  }, [auth.isAuthenticated, auth.token]);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const onCertificateIssued = (newCertificate: Certificate) => {
    setCertificates([newCertificate, ...certificates]);
  }

  return (
    <main className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <IssueCertificateForm onCertificateIssued={onCertificateIssued} />
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Issued Certificates</CardTitle>
                <CardDescription>A list of all processed certificates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>QR Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell>{cert.studentName}</TableCell>
                        <TableCell>{cert.degreeName}</TableCell>
                        <TableCell>{cert.status}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">View QR</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4">
                              <QRCodeSVG 
                                value={`${window.location.origin}/verify/${cert.id}`} 
                                size={128} 
                              />
                              <p className="mt-2 text-center text-xs text-muted-foreground">
                                ID: {cert.id}
                              </p>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}